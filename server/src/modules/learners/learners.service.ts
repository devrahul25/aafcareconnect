import { prisma } from '../../config/database';
import bcrypt from 'bcrypt';
import { v4 as uuidv4 } from 'uuid';
import { EmailService } from '../../shared/providers/email/email.service';
import { FirebaseAdminService } from '../../shared/providers/identity/firebase-admin.service';

export interface CreateLearnerDTO {
  first_name: string;
  last_name: string;
  email: string;
  phone?: string;
  
  employee_id?: string;
  job_role?: string;
  department?: string;
  line_manager?: string;
  start_date?: string;
  employment_status?: string;

  learning_group?: string;
  mandatory_learning_path?: string;
  compliance_category?: string;
  certificate_renewal_cycle?: string;
  notification_preferences?: string;
  
  assigned_course_ids?: string[];
  organization_id: string;
  organization_name?: string;
}

export class LearnersService {
  static async createLearner(data: CreateLearnerDTO) {
    const existing = await prisma.user.findUnique({ where: { email: data.email } });
    if (existing) {
      throw new Error('Email is already registered');
    }

    const learnerId = 'LRN-' + Math.random().toString(36).substring(2, 8).toUpperCase();
    const tempPassword = Math.random().toString(36).slice(-6) + Math.random().toString(36).slice(-4).toUpperCase() + '!';
    const passwordHash = await bcrypt.hash(tempPassword, 10);
    
    const identityProvider = new FirebaseAdminService();
    let firebaseUid = '';
    try {
      firebaseUid = await identityProvider.createUser(data.email, tempPassword);
    } catch (error: any) {
      if (error.code === 'auth/email-already-exists') {
        await identityProvider.deleteUserByEmail(data.email);
        firebaseUid = await identityProvider.createUser(data.email, tempPassword);
      } else {
        throw error;
      }
    }

    const result = await prisma.$transaction(async (tx: any) => {
      // 1. Create User
      const user = await tx.user.create({
        data: {
          email: data.email,
          full_name: `${data.first_name} ${data.last_name}`.trim(),
          phone: data.phone,
          password_hash: passwordHash,
          firebase_uid: firebaseUid,
          organization_id: data.organization_id,
          status: 'ACTIVE',
        }
      });

      // 2. Assign Learner Role
      let role = await tx.role.findFirst({ where: { name: 'learner', organization_id: data.organization_id } });
      if (!role) {
        role = await tx.role.create({ data: { name: 'learner', description: 'Learner', organization_id: data.organization_id } });
      }
      await tx.userRole.create({
        data: { user_id: user.id, role_id: role.id }
      });

      // 3. Create Learner Profile
      const profile = await tx.learnerProfile.create({
        data: {
          user_id: user.id,
          learner_id: learnerId,
          organization_id: data.organization_id,
          employee_id: data.employee_id,
          job_role: data.job_role,
          department: data.department,
          line_manager: data.line_manager,
          start_date: data.start_date ? new Date(data.start_date) : null,
          employment_status: data.employment_status,
          learning_group: data.learning_group,
          mandatory_learning_path: data.mandatory_learning_path,
          compliance_category: data.compliance_category,
          certificate_renewal_cycle: data.certificate_renewal_cycle,
          notification_preferences: data.notification_preferences
        }
      });

      // 4. Create Course Enrolments
      if (data.assigned_course_ids && data.assigned_course_ids.length > 0) {
        for (const courseId of data.assigned_course_ids) {
          await tx.courseEnrolment.create({
            data: {
              organization_id: data.organization_id,
              course_id: courseId,
              user_id: user.id,
              status: 'ENROLLED'
            }
          });
        }
      }

      // 5. Create basic Compliance Record if a category is provided
      if (data.compliance_category) {
        await tx.complianceRecord.create({
          data: {
            organization_id: data.organization_id,
            type: 'POLICY',
            title: `Compliance Setup: ${data.compliance_category}`,
            assigned_to_id: user.id,
            status: 'OPEN'
          }
        });
      }

      return { user, profile, tempPassword, learnerId };
    });

    // Send Welcome Email
    try {
      const emailService = new EmailService();
      await emailService.sendLearnerWelcomeEmail(result.user.email, {
        first_name: data.first_name,
        learner_id: result.learnerId,
        temp_password: result.tempPassword,
        organization_name: data.organization_name || 'Your Organization'
      });
    } catch (e) {
      console.error('Welcome email failed to send (non-fatal):', e);
    }

    return result;
  }
}
