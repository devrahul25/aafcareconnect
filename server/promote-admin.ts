import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function promote() {
  const email = 'rahulgoyal90000@gmail.com';
  const superAdminRole = await prisma.role.findFirst({
    where: { name: 'super_admin' }
  });

  if (!superAdminRole) {
    console.error('super_admin role not found!');
    return;
  }

  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error('User not found!');
    return;
  }

  // Delete existing roles for this user
  await prisma.userRole.deleteMany({
    where: { user_id: user.id }
  });

  // Assign super_admin role
  await prisma.userRole.create({
    data: {
      user_id: user.id,
      role_id: superAdminRole.id
    }
  });

  console.log(`Successfully promoted ${email} to super_admin!`);
}

promote().finally(() => prisma.$disconnect());
