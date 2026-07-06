import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('🔧 Fixing user permissions...');

    // 1. Find the "user" role (or create it if it doesn't exist)
    let userRole = await prisma.role.findFirst({
        where: { name: 'user' }
    });

    if (!userRole) {
        console.log('Creating default "user" role...');
        const org = await prisma.organization.findFirst();
        if (!org) {
            throw new Error('No organization found. Please run seed first.');
        }

        userRole = await prisma.role.create({
            data: {
                name: 'user',
                description: 'Standard user',
                organization_id: org.id
            }
        });
    }

    // 2. Get all permissions that a standard user should have
    const userPermissions = await prisma.permission.findMany({
        where: {
            OR: [
                { resource: 'courses', action: 'read' },
                { resource: 'courses', action: 'create' },
                { resource: 'courses', action: 'update' },
                { resource: 'compliance', action: 'read' },
                { resource: 'storage', action: 'upload' },
            ]
        }
    });

    console.log(`Found ${userPermissions.length} permissions for user role`);

    // 3. Assign permissions to user role (if not already assigned)
    for (const perm of userPermissions) {
        const existing = await prisma.rolePermission.findFirst({
            where: {
                role_id: userRole.id,
                permission_id: perm.id
            }
        });

        if (!existing) {
            await prisma.rolePermission.create({
                data: {
                    role_id: userRole.id,
                    permission_id: perm.id
                }
            });
            console.log(`✓ Assigned ${perm.resource}:${perm.action} to user role`);
        }
    }

    // 4. Find all users without the user role and activate them
    const users = await prisma.user.findMany({
        where: {
            email_verified: true,
            user_roles: {
                none: {}
            }
        }
    });

    console.log(`Found ${users.length} users without roles`);

    for (const user of users) {
        // Assign user role
        await prisma.userRole.create({
            data: {
                user_id: user.id,
                role_id: userRole.id
            }
        });

        // Activate the user if they're pending approval
        if (user.status === 'PENDING_APPROVAL' || user.status === 'INACTIVE') {
            await prisma.user.update({
                where: { id: user.id },
                data: { status: 'ACTIVE' }
            });
            console.log(`✓ Activated and assigned user role to: ${user.email}`);
        }
    }

    console.log('✅ User permissions fixed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Fix failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
