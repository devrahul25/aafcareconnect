import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ─── Role definitions ─────────────────────────────────────────────────────────
const ROLES = [
  {
    slug: 'super_admin',
    name: 'Super Admin',
    description: 'Full unrestricted platform access across all organisations',
  },
  {
    slug: 'org_admin',
    name: 'Organisation Admin',
    description: 'Full administrative access within their organisation',
  },
  {
    slug: 'manager',
    name: 'Manager / Supervisor',
    description: 'Can assign courses, manage learners, and view compliance reports',
  },
  {
    slug: 'trainer',
    name: 'Trainer / Course Creator',
    description: 'Can create, edit, and publish courses; cannot manage users',
  },
  {
    slug: 'learner',
    name: 'Learner / Foster Carer / Staff Member',
    description: 'Can access and complete their assigned courses',
  },
];

// ─── Permission definitions ───────────────────────────────────────────────────
const PERMISSIONS = [
  // System
  { resource: 'system',     action: 'root',    description: 'Full unrestricted access (super_admin only)' },
  // Admin (legacy authorize middleware check)
  { resource: 'admin',      action: 'manage',  description: 'Manage all admin features' },
  // Users
  { resource: 'users',      action: 'create',  description: 'Create new users' },
  { resource: 'users',      action: 'read',    description: 'View users' },
  { resource: 'users',      action: 'update',  description: 'Edit users' },
  { resource: 'users',      action: 'delete',  description: 'Delete users' },
  { resource: 'users',      action: 'approve', description: 'Approve pending user registrations' },
  { resource: 'users',      action: 'manage',  description: 'Full user management' },
  // Courses
  { resource: 'courses',    action: 'create',  description: 'Create courses' },
  { resource: 'courses',    action: 'read',    description: 'View courses' },
  { resource: 'courses',    action: 'update',  description: 'Update courses' },
  { resource: 'courses',    action: 'delete',  description: 'Delete courses' },
  { resource: 'courses',    action: 'manage',  description: 'Full course management' },
  // Compliance
  { resource: 'compliance', action: 'create',  description: 'Create compliance records' },
  { resource: 'compliance', action: 'read',    description: 'View compliance records' },
  { resource: 'compliance', action: 'update',  description: 'Update compliance records' },
  { resource: 'compliance', action: 'delete',  description: 'Delete compliance records' },
  // Storage
  { resource: 'storage',    action: 'upload',  description: 'Upload files to storage' },
  { resource: 'storage',    action: 'read',    description: 'Read files from storage' },
];

// ─── Role → Permission mappings ───────────────────────────────────────────────
type PermRef = { resource: string; action: string };

const ROLE_PERMISSIONS: Record<string, PermRef[]> = {
  super_admin: [
    { resource: 'system',     action: 'root' },
    { resource: 'admin',      action: 'manage' },
  ],
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
    { resource: 'storage',    action: 'read' },
  ],
};

// ─── Main ─────────────────────────────────────────────────────────────────────
async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create or find the Demo Organisation
  let demoOrg = await prisma.organization.findFirst({
    where: { name: 'CareConnect Demo Authority' },
  });
  if (!demoOrg) {
    demoOrg = await prisma.organization.create({
      data: {
        name: 'CareConnect Demo Authority',
        type: 'LOCAL_AUTHORITY',
        status: 'ACTIVE',
      },
    });
  }
  console.log(`✅ Organisation: ${demoOrg.name}`);

  // 2. Upsert Permissions
  const permMap: Record<string, any> = {};
  for (const p of PERMISSIONS) {
    let perm = await prisma.permission.findFirst({
      where: { resource: p.resource, action: p.action },
    });
    if (!perm) {
      perm = await prisma.permission.create({ data: p });
    }
    permMap[`${p.resource}:${p.action}`] = perm;
  }
  console.log(`✅ Permissions provisioned: ${Object.keys(permMap).length}`);

  // 3. Upsert Roles
  const roleMap: Record<string, any> = {};
  for (const r of ROLES) {
    let role = await prisma.role.findFirst({
      where: { organization_id: demoOrg.id, name: r.slug },
    });
    if (!role) {
      role = await prisma.role.create({
        data: {
          name: r.slug,
          description: r.description,
          organization_id: demoOrg.id,
          is_system: true,
        },
      });
    }
    roleMap[r.slug] = role;
  }
  console.log(`✅ Roles provisioned: ${Object.keys(roleMap).length}`);

  // 4. Attach Permissions to Roles
  let rpCount = 0;
  for (const [slug, perms] of Object.entries(ROLE_PERMISSIONS)) {
    const role = roleMap[slug];
    if (!role) continue;
    for (const { resource, action } of perms) {
      const perm = permMap[`${resource}:${action}`];
      if (!perm) continue;
      const exists = await prisma.rolePermission.findUnique({
        where: { role_id_permission_id: { role_id: role.id, permission_id: perm.id } },
      });
      if (!exists) {
        await prisma.rolePermission.create({
          data: { role_id: role.id, permission_id: perm.id },
        });
        rpCount++;
      }
    }
  }
  console.log(`✅ Role-permission links: ${rpCount} created`);

  // 5. Provision Super Admin user
  const adminEmail = 'admin@demo.com';
  let superAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!superAdmin) {
    superAdmin = await prisma.user.create({
      data: {
        email: adminEmail,
        firebase_uid: 'SEED_FIREBASE_UID_SUPER_ADMIN',
        status: 'ACTIVE',
        email_verified: true,
        organization_id: demoOrg.id,
        full_name: 'System Super Admin',
      },
    });
  }

  // Attach super_admin role
  const superAdminRole = roleMap['super_admin'];
  if (superAdminRole) {
    const existing = await prisma.userRole.findUnique({
      where: { user_id_role_id: { user_id: superAdmin.id, role_id: superAdminRole.id } },
    });
    if (!existing) {
      await prisma.userRole.create({
        data: { user_id: superAdmin.id, role_id: superAdminRole.id },
      });
    }
  }
  console.log(`✅ Super Admin provisioned: ${superAdmin.email}`);

  console.log('\n✅ Seeding completed successfully.');
  console.log('\nRoles seeded:');
  for (const r of ROLES) {
    console.log(`  • ${r.name} (${r.slug})`);
  }
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
