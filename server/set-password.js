const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const prisma = new PrismaClient();

async function main() {
  const email = 'admin@demo.com';
  const password = 'Password123!';
  const password_hash = await bcrypt.hash(password, 10);
  
  await prisma.user.updateMany({
    where: { email },
    data: { password_hash }
  });
  console.log(`Set password for ${email} to ${password}`);
}

main().catch(console.error).finally(() => prisma.$disconnect());
