import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function checkUsers() {
  const users = await prisma.user.findMany({
    include: { user_roles: { include: { role: true } } }
  });
  console.log(JSON.stringify(users, null, 2));
}

checkUsers().finally(() => prisma.$disconnect());
