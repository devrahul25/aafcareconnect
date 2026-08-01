import { Request, Response } from 'express';
import { prisma } from '../../config/database';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { firebaseAuth } from '../../config/firebase';
import { CoursesService } from '../courses/courses.service';
import { EmailService } from '../../shared/providers/email/email.service';

const coursesService = new CoursesService();
const emailService = new EmailService();

// --- Organization Types ---

export const getOrganizationTypes = async (req: Request, res: Response): Promise<void> => {
  try {
    const types = await prisma.organizationTypeOption.findMany({
      orderBy: { created_at: 'asc' }
    });
    res.status(200).json({ success: true, data: types });
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const addOrganizationType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { name } = req.body;
    if (!name) {
      res.status(400).json({ success: false, error: "Name is required" });
      return;
    }
    const newType = await prisma.organizationTypeOption.create({
      data: { name }
    });
    res.status(201).json({ success: true, data: newType });
  } catch (error: any) {
    if (error.code === 'P2002') {
      res.status(400).json({ success: false, error: "This organization type already exists" });
    } else {
      res.status(500).json({ success: false, error: error.message });
    }
  }
};

export const deleteOrganizationType = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    await prisma.organizationTypeOption.delete({
      where: { id: id as string }
    });
    res.status(204).send();
  } catch (error: any) {
    res.status(500).json({ success: false, error: error.message });
  }
};

export const createOrganization = async (req: Request, res: Response): Promise<void> => {
  const {
    name, type, email, phone, website, logo_url,
    address, city, county, country, postcode,
    registration_number, ofsted_number,
    admin_name, admin_email, admin_phone, admin_job_title,
    plan, trial_or_paid, max_learners, max_staff,
    assigned_template_ids = []
  } = req.body;

  try {
    // 1. Validate Email Uniqueness (Organization Admin)
    const existingUser = await prisma.user.findUnique({
      where: { email: admin_email }
    });
    if (existingUser) {
      res.status(400).json({ error: 'Email already exists for another user.' });
      return;
    }

    // 2. Generate secure temporary password & hash it
    const tempPassword = Math.random().toString(36).slice(-8) + 'A1!'; // e.g., "x8j92kA1!"
    const passwordHash = await bcrypt.hash(tempPassword, 10);

    // 2.5 Create user in Firebase Auth
    const firebaseRecord = await firebaseAuth.createUser({
      email: admin_email,
      password: tempPassword,
      displayName: admin_name
    });

    // 3. Execute Transaction
    const result = await prisma.$transaction(async (tx) => {
      // Create Organization
      const organization = await tx.organization.create({
        data: {
          name,
          type,
          email,
          phone,
          website,
          logo_url,
          address,
          city,
          county,
          country,
          postcode,
          registration_number,
          ofsted_number,
          status: trial_or_paid === 'TRIAL' ? 'TRIAL' : 'ACTIVE',
        }
      });

      // Create Admin User
      const user = await tx.user.create({
        data: {
          firebase_uid: firebaseRecord.uid, // Use actual Firebase UID
          email: admin_email,
          full_name: admin_name,
          phone: admin_phone,
          password_hash: passwordHash,
          organization_id: organization.id,
          status: 'ACTIVE',
        }
      });

      // Create Subscription
      const subscription = await tx.subscription.create({
        data: {
          organization_id: organization.id,
          plan: plan,
          status: 'ACTIVE',
          max_learners: max_learners || 50,
          max_staff: max_staff || 10,
        }
      });

      // Define Role Permissions
      const ROLE_PERMISSIONS: Record<string, { resource: string; action: string }[]> = {
        org_admin: [
          { resource: 'admin',      action: 'manage' },
          { resource: 'users',      action: 'manage' },
          { resource: 'users',      action: 'approve' },
          { resource: 'courses',    action: 'manage' },
          { resource: 'compliance', action: 'create' },
          { resource: 'compliance', action: 'read' },
          { resource: 'compliance', action: 'update' },
          { resource: 'compliance', action: 'delete' },
          { resource: 'storage',    action: 'upload' },
          { resource: 'storage',    action: 'read' },
        ],
        manager: [
          { resource: 'users',      action: 'read' },
          { resource: 'users',      action: 'update' },
          { resource: 'courses',    action: 'read' },
          { resource: 'compliance', action: 'read' },
          { resource: 'compliance', action: 'update' },
          { resource: 'storage',    action: 'read' },
        ],
        trainer: [
          { resource: 'courses',    action: 'create' },
          { resource: 'courses',    action: 'read' },
          { resource: 'courses',    action: 'update' },
          { resource: 'storage',    action: 'upload' },
          { resource: 'storage',    action: 'read' },
        ],
        learner: [
          { resource: 'courses',    action: 'read' },
          { resource: 'compliance', action: 'read' },
        ]
      };

      // Fetch all system permissions once
      const allPermissions = await tx.permission.findMany();

      // Create standard roles for this organization and assign permissions
      const rolesToCreate = [
        { name: 'org_admin', description: 'Organization Administrator' },
        { name: 'manager', description: 'Manager' },
        { name: 'trainer', description: 'Trainer' },
        { name: 'learner', description: 'Learner' }
      ];

      let orgAdminRoleId = '';

      for (const roleDef of rolesToCreate) {
        // Find matching permission IDs for this role
        const rolePerms = ROLE_PERMISSIONS[roleDef.name] || [];
        const matchingPermIds = allPermissions
          .filter(p => rolePerms.some(rp => rp.resource === p.resource && rp.action === p.action))
          .map(p => ({ permission_id: p.id }));

        const createdRole = await tx.role.create({
          data: {
            organization_id: organization.id,
            name: roleDef.name,
            description: roleDef.description,
            is_system: true,
            permissions: {
              create: matchingPermIds
            }
          }
        });

        if (roleDef.name === 'org_admin') {
          orgAdminRoleId = createdRole.id;
        }
      }

      // Assign org_admin role to the created user
      await tx.userRole.create({
        data: {
          user_id: user.id,
          role_id: orgAdminRoleId
        }
      });

      return { organization, user, subscription };
    });

    // 4. Assign selected course templates to the new organization
    if (assigned_template_ids && assigned_template_ids.length > 0) {
      for (const templateId of assigned_template_ids) {
        try {
          await coursesService.assignTemplateToOrganization(
            result.organization.id, 
            templateId, 
            result.user.id // Use the new org admin ID as the creator
          );
        } catch (err) {
          console.error(`Failed to assign template ${templateId} to organization ${result.organization.id}`, err);
          // Don't fail the whole request, continue assigning the rest
        }
      }
    }

    try {
      const emailService = new EmailService();
      await emailService.sendOrganizationWelcomeEmail(admin_email, {
        name,
        admin_name,
        temp_password: tempPassword,
        org_id: `ORG-${result.organization.id.substring(0, 6).toUpperCase()}`
      });
      console.log("Organization welcome email sent to", admin_email);
    } catch (emailError) {
      console.error("Failed to send welcome email:", emailError);
      // We don't fail the request since the user/org is already created.
    }

    res.status(201).json({
      success: true,
      data: {
        organization: result.organization,
        admin: {
          id: result.user.id,
          email: result.user.email,
          name: result.user.full_name
        },
        subscription: result.subscription,
        tempPassword, // Returning just for the frontend prototype to show in the success modal/alert
        emailPreviewUrl: null
      }
    });
  } catch (error: any) {
    console.error('Create Organization Error:', error);
    res.status(500).json({ error: error.message || 'Failed to create organization' });
  }
};

export const listOrganizations = async (req: Request, res: Response): Promise<void> => {
  try {
    const organizations = await prisma.organization.findMany({
      include: {
        subscriptions: true,
        users: {
          take: 1, // Getting one user to act as the primary admin in the list view
        },
        courses: {
          select: {
            parent_template_id: true,
            status: true
          }
        }
      },
      orderBy: { created_at: 'desc' }
    });

    res.status(200).json({ success: true, data: organizations });
  } catch (error: any) {
    console.error('List Organizations Error:', error);
    res.status(500).json({ error: 'Failed to list organizations' });
  }
};

export const updateOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { name, email, phone, status, assigned_template_ids } = req.body;

    const organization = await prisma.organization.update({
      where: { id: id as string },
      data: {
        name,
        email,
        phone,
        status,
      }
    });

    if (Array.isArray(assigned_template_ids)) {
      const templateIds: string[] = assigned_template_ids;

      // Find existing assigned templates
      const existingCourses = await prisma.course.findMany({
        where: {
          organization_id: id as string,
          parent_template_id: { not: null }
        }
      });

      const existingTemplateIds: string[] = existingCourses.map(c => c.parent_template_id as string);

      // Templates to add
      const toAdd = templateIds.filter((tid: string) => !existingTemplateIds.includes(tid));
      
      // Templates to remove/archive
      const toRemove = existingTemplateIds.filter((tid: string) => !templateIds.includes(tid));
      const toKeep = existingTemplateIds.filter((tid: string) => templateIds.includes(tid));

      // 1. Add new
      for (const templateId of toAdd) {
        try {
          // Find an admin user in the org to attribute creation
          const orgAdmin = await prisma.user.findFirst({
            where: { organization_id: id as string },
            orderBy: { created_at: 'asc' }
          });
          await coursesService.assignTemplateToOrganization(id as string, templateId, orgAdmin?.id);
        } catch (err) {
          console.error(`Failed to assign template ${templateId}`, err);
        }
      }

      // 2. Reactivate ones that were kept (in case they were previously archived)
      for (const templateId of toKeep) {
        await prisma.course.updateMany({
          where: { organization_id: id as string, parent_template_id: templateId },
          data: { status: 'PUBLISHED', deleted_at: null }
        });
      }

      // 3. Archive removed ones
      for (const templateId of toRemove) {
        await prisma.course.updateMany({
          where: { organization_id: id as string, parent_template_id: templateId },
          data: { status: 'ARCHIVED' }
        });
      }
    }

    res.status(200).json({ success: true, data: organization });
  } catch (error: any) {
    console.error('Update Organization Error:', error);
    res.status(500).json({ error: error.message || 'Failed to update organization' });
  }
};

export const deleteOrganization = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // 1. Fetch all users belonging to this organization to delete from Firebase Auth
    const users = await prisma.user.findMany({
      where: { organization_id: id as string }
    });

    // 2. Delete users from Firebase Auth
    for (const user of users) {
      if (user.firebase_uid) {
        try {
          await firebaseAuth.deleteUser(user.firebase_uid);
        } catch (firebaseErr: any) {
          // If user doesn't exist in Firebase, ignore and continue
          if (firebaseErr.code !== 'auth/user-not-found') {
            console.error(`Failed to delete Firebase user ${user.firebase_uid}:`, firebaseErr);
          }
        }
      }
    }

    // 3. Delete from PostgreSQL in a transaction
    // Because of onDelete: Restrict for Organization -> User, and self-referencing foreign keys, we MUST clean up first.
    await prisma.$transaction(async (tx) => {
      // Clear cyclic references that default to Restrict
      await tx.user.updateMany({
        where: { organization_id: id as string },
        data: { approved_by: null }
      });

      await tx.fosterCarer.updateMany({
        where: { organization_id: id as string },
        data: { ssw_id: null }
      });

      // Delete child models that have Restrict constraints
      await tx.course.deleteMany({
        where: { organization_id: id as string }
      });

      await tx.user.deleteMany({
        where: { organization_id: id as string }
      });
      
      await tx.organization.delete({
        where: { id: id as string }
      });
    });

    res.status(200).json({ success: true, message: 'Organization deleted successfully' });
  } catch (error: any) {
    console.error('Delete Organization Error:', error);
    res.status(500).json({ error: error.message || 'Failed to delete organization' });
  }
};
