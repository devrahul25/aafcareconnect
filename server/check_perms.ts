import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const role = await prisma.role.findFirst({
    where: { name: 'org_admin' },
    include: { permissions: { include: { permission: true } } }
  });
  console.log(JSON.stringify(role?.permissions, null, 2));
}
main().catch(console.error).finally(() => prisma.$disconnect());
