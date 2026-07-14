const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();
async function main() {
  const org = await prisma.organization.findFirst();
  if (!org) return console.log("No org");
  try {
    await prisma.user.deleteMany({ where: { organization_id: org.id } });
    await prisma.course.deleteMany({ where: { organization_id: org.id } });
    await prisma.organization.delete({ where: { id: org.id } });
    console.log("Success");
  } catch (e) {
    console.error(e);
  }
}
main();
