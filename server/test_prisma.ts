import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  const existingCourses = await prisma.course.findMany({
    where: {
      organization_id: "123",
      parent_template_id: { not: null }
    }
  });
}
