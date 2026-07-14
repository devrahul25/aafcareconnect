import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

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

async function main() {
  const orgs = await prisma.organization.findMany();
  
  for (const org of orgs) {
    for (const [roleName, perms] of Object.entries(ROLE_PERMISSIONS)) {
      const role = await prisma.role.findFirst({
        where: { organization_id: org.id, name: roleName }
      });
      
      if (role) {
        // Find existing permissions to attach
        const permRecords = await prisma.permission.findMany({
          where: {
            OR: perms.map(p => ({ resource: p.resource, action: p.action }))
          }
        });
        
        for (const p of permRecords) {
          await prisma.rolePermission.upsert({
            where: {
              role_id_permission_id: {
                role_id: role.id,
                permission_id: p.id
              }
            },
            create: {
              role_id: role.id,
              permission_id: p.id
            },
            update: {}
          });
        }
      }
    }
  }
  console.log('Fixed permissions for existing roles!');
}

main().catch(console.error).finally(() => prisma.$disconnect());
