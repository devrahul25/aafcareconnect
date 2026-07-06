import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
    console.log('📊 Checking user status...\n');

    const users = await prisma.user.findMany({
        include: {
            user_roles: {
                include: {
                    role: {
                        include: {
                            permissions: {
                                include: {
                                    permission: true
                                }
                            }
                        }
                    }
                }
            }
        }
    });

    console.log(`Total users: ${users.length}\n`);

    for (const user of users) {
        console.log(`Email: ${user.email}`);
        console.log(`Status: ${user.status}`);
        console.log(`Email Verified: ${user.email_verified}`);
        console.log(`Roles: ${user.user_roles.map(ur => ur.role.name).join(', ') || 'NONE'}`);

        const permissions = new Set<string>();
        for (const ur of user.user_roles) {
            for (const rp of ur.role.permissions) {
                permissions.add(`${rp.permission.resource}:${rp.permission.action}`);
            }
        }
        console.log(`Permissions: ${Array.from(permissions).join(', ') || 'NONE'}`);
        console.log('---');
    }
}

main()
    .catch((e) => {
        console.error('❌ Check failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
