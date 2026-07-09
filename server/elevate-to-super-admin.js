const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  const email = 'rahulgoyal00002@gmail.com';
  
  const user = await prisma.user.findFirst({ where: { email } });
  if (!user) {
    console.log("User not found");
    return;
  }

  let saRole = await prisma.role.findFirst({ where: { name: 'super_admin' } });
  
  if (!saRole) {
    console.log("Super Admin role not found. Please run the seeder first (npm run seed).");
    return;
  }

  const existing = await prisma.userRole.findFirst({
    where: { user_id: user.id, role_id: saRole.id }
  });

  if (!existing) {
    await prisma.userRole.deleteMany({ where: { user_id: user.id } });
    
    await prisma.userRole.create({
      data: {
        user_id: user.id,
        role_id: saRole.id
      }
    });
    console.log(`Elevated ${email} to Super Admin.`);
  } else {
    console.log(`${email} is already a Super Admin.`);
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
