import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import { tokenService } from '../src/shared/providers/token/jwt.token.service';

const prisma = new PrismaClient();

async function diagnose() {
    console.log('🔍 Diagnosing Authentication Issue\n');

    // 1. Check admin user
    const adminUser = await prisma.user.findUnique({
        where: { email: 'admin@aafcareconnect.com' },
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

    if (!adminUser) {
        console.log('❌ Admin user not found!');
        return;
    }

    console.log('✓ Admin user found:');
    console.log(`  Email: ${adminUser.email}`);
    console.log(`  Status: ${adminUser.status}`);
    console.log(`  Firebase UID: ${adminUser.firebase_uid}`);
    console.log(`  Organization ID: ${adminUser.organization_id}`);
    console.log(`  Roles: ${adminUser.user_roles.map(ur => ur.role.name).join(', ')}`);

    // Get all permissions
    const allPermissions = new Set<string>();
    for (const ur of adminUser.user_roles) {
        for (const rp of ur.role.permissions) {
            allPermissions.add(`${rp.permission.resource}:${rp.permission.action}`);
        }
    }
    console.log(`  Permissions: ${Array.from(allPermissions).join(', ')}`);

    // 2. Generate a test JWT token
    console.log('\n📝 Generating test JWT token...');

    const payload = {
        sub: adminUser.id,
        org: adminUser.organization_id,
        role: adminUser.user_roles[0]?.role.name || 'admin',
        sid: 'test-session-id',
        session_version: adminUser.session_version,
    };

    try {
        const testToken = tokenService.generateAccessToken(payload);
        console.log('✓ Test JWT token generated successfully');
        console.log(`\nToken to use in API calls:\n${testToken}\n`);

        // Decode to verify
        const decoded = tokenService.verifyAccessToken(testToken);
        console.log('Token payload:', JSON.stringify(decoded, null, 2));
    } catch (error: any) {
        console.log('❌ Token generation failed:', error.message);
    }

    // 3. Check devilal user
    console.log('\n---\n');
    const regularUser = await prisma.user.findUnique({
        where: { email: 'devilal0214@gmail.com' },
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

    if (regularUser) {
        console.log('✓ Regular user found:');
        console.log(`  Email: ${regularUser.email}`);
        console.log(`  Status: ${regularUser.status}`);
        console.log(`  Roles: ${regularUser.user_roles.map(ur => ur.role.name).join(', ')}`);

        const userPermissions = new Set<string>();
        for (const ur of regularUser.user_roles) {
            for (const rp of ur.role.permissions) {
                userPermissions.add(`${rp.permission.resource}:${rp.permission.action}`);
            }
        }
        console.log(`  Permissions: ${Array.from(userPermissions).join(', ')}`);
    }

    // 4. Check if there are any active sessions
    const sessions = await prisma.userSession.findMany({
        where: {
            OR: [
                { user_id: adminUser.id },
                { user_id: regularUser?.id }
            ],
            revoked_at: null
        },
        orderBy: { created_at: 'desc' },
        take: 5
    });

    console.log(`\n📊 Active sessions: ${sessions.length}`);
    for (const session of sessions) {
        console.log(`  - Session ${session.id.substring(0, 8)}... for user ${session.user_id.substring(0, 8)}... created ${session.created_at}`);
    }
}

diagnose()
    .catch((e) => {
        console.error('❌ Diagnosis failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
