import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // 1. Create Demo Organization
  const demoOrg = await prisma.organization.upsert({
    where: { name: 'CareConnect Demo Authority' } as any, // Not uniquely constrained by name in schema, wait let me check schema, wait we can just use create if findFirst fails
    update: {},
    create: {
      name: 'CareConnect Demo Authority',
      type: 'LOCAL_AUTHORITY',
      status: 'ACTIVE',
    }
  }).catch(async () => {
    let org = await prisma.organization.findFirst({ where: { name: 'CareConnect Demo Authority' } });
    if (!org) {
      org = await prisma.organization.create({
        data: { name: 'CareConnect Demo Authority', type: 'LOCAL_AUTHORITY', status: 'ACTIVE' }
      });
    }
    return org;
  });
  console.log(`✅ Organization created: ${demoOrg.name}`);

  // 2. Provision Core Permissions
  const permissionsData = [
    { resource: 'users', action: 'create', description: 'Create new users' },
    { resource: 'users', action: 'read', description: 'View users' },
    { resource: 'users', action: 'update', description: 'Edit users' },
    { resource: 'users', action: 'delete', description: 'Delete users' },
    { resource: 'courses', action: 'create', description: 'Create courses' },
    { resource: 'courses', action: 'read', description: 'View courses' },
    { resource: 'courses', action: 'update', description: 'Update courses' },
    { resource: 'courses', action: 'delete', description: 'Delete courses' },
    { resource: 'courses', action: 'manage', description: 'Manage all courses' },
    { resource: 'compliance', action: 'create', description: 'Create compliance records' },
    { resource: 'compliance', action: 'read', description: 'View compliance records' },
    { resource: 'compliance', action: 'update', description: 'Update compliance records' },
    { resource: 'compliance', action: 'delete', description: 'Delete compliance records' },
    { resource: 'storage', action: 'upload', description: 'Upload files to storage' },
    { resource: 'system', action: 'root', description: 'Full Unrestricted Access' },
  ];

  const permissions = [];
  for (const p of permissionsData) {
    let perm = await prisma.permission.findFirst({ where: { resource: p.resource, action: p.action } });
    if (!perm) {
      perm = await prisma.permission.create({ data: p });
    }
    permissions.push(perm);
  }
  console.log(`✅ Permissions provisioned: ${permissions.length}`);

  // 3. Provision Core Roles
  const rolesData = [
    { name: 'admin', description: 'Administrator with full system access' },
    { name: 'manager', description: 'Manager with elevated privileges' },
    { name: 'user', description: 'Standard user' },
  ];

  const roles = [];
  for (const r of rolesData) {
    let role = await prisma.role.findFirst({ where: { name: r.name } });
    if (!role) {
      role = await prisma.role.create({
        data: {
          ...r,
          organization_id: demoOrg.id
        }
      });
    }
    roles.push(role);
  }
  console.log(`✅ Roles provisioned: ${roles.length}`);

  // 4. Map Permissions to Roles
  // Admin gets system:root
  const adminRole = roles.find(r => r.name === 'admin');
  const rootPerm = permissions.find(p => p.resource === 'system' && p.action === 'root');

  if (adminRole && rootPerm) {
    const existingRP = await prisma.rolePermission.findFirst({
      where: { role_id: adminRole.id, permission_id: rootPerm.id }
    });
    if (!existingRP) {
      await prisma.rolePermission.create({
        data: { role_id: adminRole.id, permission_id: rootPerm.id }
      });
    }
  }

  // 5. Provision Super Admin User
  const adminEmail = 'admin@demo.com';
  let superAdmin = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!superAdmin) {
    superAdmin = await prisma.user.create({
      data: {
        email: adminEmail,
        firebase_uid: 'SEED_FIREBASE_UID_ADMIN', // Mock UID for seeding
        status: 'ACTIVE',
        email_verified: true,
        organization_id: demoOrg.id,
        full_name: 'System Admin',
      }
    });
  }

  // Attach Admin role to user
  if (adminRole) {
    const existingUR = await prisma.userRole.findFirst({
      where: { user_id: superAdmin.id, role_id: adminRole.id }
    });
    if (!existingUR) {
      await prisma.userRole.create({
        data: { user_id: superAdmin.id, role_id: adminRole.id }
      });
    }
  }
  console.log(`✅ Super Admin provisioned: ${superAdmin.email}`);

  console.log('✅ Seeding completed successfully.');
}

main()
  .catch((e) => {
    console.error('❌ Seeding failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
