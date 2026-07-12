const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const org = await prisma.organization.findFirst();
  if (!org) return console.log('No org');
  
  await prisma.course.create({
    data: {
      organization_id: org.id,
      title: 'Test Assigned Course',
      category: 'Health & Safety',
      level: 'FOUNDATION',
      status: 'PUBLISHED',
      is_template: false
    }
  });
  console.log('Course created');
}
main().catch(console.error).finally(() => prisma.$disconnect());
