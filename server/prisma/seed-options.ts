import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Seeding organization types...');
  const types = [
    'INDEPENDENT_FOSTERING_AGENCY',
    'LOCAL_AUTHORITY',
    'CHILDRENS_HOME',
    'SUPPORTED_ACCOMMODATION',
    'CARE_AGENCY'
  ];

  for (const name of types) {
    await prisma.organizationTypeOption.upsert({
      where: { name },
      update: {},
      create: {
        name,
        description: name.replace(/_/g, ' ')
      }
    });
  }
  
  console.log('Seeding course categories...');
  const categories = [
    'Safeguarding',
    'Health & Safety',
    'First Aid',
    'Mental Health',
    'Foster Care Skills'
  ];

  for (const name of categories) {
    await prisma.courseCategoryOption.upsert({
      where: { name },
      update: {},
      create: { name }
    });
  }

  console.log('Done!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
