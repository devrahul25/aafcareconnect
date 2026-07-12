import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const permissions = [
  // Dashboard
  { resource: 'Dashboard', action: 'View Dashboard', description: 'Access the main dashboard' },
  { resource: 'Dashboard', action: 'View Analytics', description: 'View analytics and statistics' },
  // Learners
  { resource: 'Learners', action: 'View Learners', description: 'View learner list and profiles' },
  { resource: 'Learners', action: 'Create Learners', description: 'Add new learners' },
  { resource: 'Learners', action: 'Edit Learners', description: 'Modify learner details' },
  { resource: 'Learners', action: 'Delete Learners', description: 'Remove learners' },
  { resource: 'Learners', action: 'Suspend Learners', description: 'Suspend learner access' },
  { resource: 'Learners', action: 'Export Learners', description: 'Export learner data' },
  // Staff
  { resource: 'Staff', action: 'View Staff', description: 'View staff members' },
  { resource: 'Staff', action: 'Create Staff', description: 'Add new staff' },
  { resource: 'Staff', action: 'Edit Staff', description: 'Modify staff details' },
  { resource: 'Staff', action: 'Delete Staff', description: 'Remove staff' },
  { resource: 'Staff', action: 'Suspend Staff', description: 'Suspend staff access' },
  // Course Assignment
  { resource: 'Course Assignment', action: 'View Courses', description: 'View available courses' },
  { resource: 'Course Assignment', action: 'Assign Courses', description: 'Assign courses to learners' },
  { resource: 'Course Assignment', action: 'Remove Course Assignment', description: 'Remove assigned courses' },
  { resource: 'Course Assignment', action: 'View Progress', description: 'View learner progress' },
  // Compliance
  { resource: 'Compliance', action: 'View Compliance', description: 'View compliance records' },
  { resource: 'Compliance', action: 'Edit Compliance', description: 'Edit compliance records' },
  { resource: 'Compliance', action: 'Export Compliance', description: 'Export compliance records' },
  // Certificates
  { resource: 'Certificates', action: 'View Certificates', description: 'View certificates' },
  { resource: 'Certificates', action: 'Download Certificates', description: 'Download certificates' },
  // Reports
  { resource: 'Reports', action: 'View Reports', description: 'View generated reports' },
  { resource: 'Reports', action: 'Export Reports', description: 'Export reports' },
  // Documents
  { resource: 'Documents', action: 'View Documents', description: 'View documents' },
  { resource: 'Documents', action: 'Upload Documents', description: 'Upload documents' },
  { resource: 'Documents', action: 'Delete Documents', description: 'Delete documents' },
  // Administration
  { resource: 'Administration', action: 'View Settings', description: 'View organization settings' },
  { resource: 'Administration', action: 'Manage Roles', description: 'Manage custom roles' },
  { resource: 'Administration', action: 'Manage Permissions', description: 'Manage permissions' }
];

async function main() {
  console.log('Seeding permissions...');
  
  for (const perm of permissions) {
    await prisma.permission.upsert({
      where: {
        resource_action: {
          resource: perm.resource,
          action: perm.action
        }
      },
      update: {},
      create: perm
    });
  }
  
  console.log('Permissions seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
