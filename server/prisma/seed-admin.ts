import { PrismaClient } from '@prisma/client';
import * as admin from 'firebase-admin';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient();

// Initialize Firebase Admin if not already initialized
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert({
            projectId: process.env.FIREBASE_PROJECT_ID,
            clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
            privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
        }),
    });
}

async function createFirstAdmin() {
    console.log('🔧 Creating first admin user...\n');

    // Configuration
    const ADMIN_EMAIL = process.env.FIRST_ADMIN_EMAIL || 'admin@aafcareconnect.com';
    const ADMIN_PASSWORD = process.env.FIRST_ADMIN_PASSWORD || 'Admin123!@#';
    const ADMIN_NAME = process.env.FIRST_ADMIN_NAME || 'System Administrator';

    try {
        // Check if organization exists
        let organization = await prisma.organization.findFirst();

        if (!organization) {
            console.log('📍 Creating default organization...');
            organization = await prisma.organization.create({
                data: {
                    name: 'AAF CareConnect',
                    type: 'INDEPENDENT_FOSTERING_AGENCY',
                    status: 'ACTIVE',
                    enabled_modules: ['courses', 'compliance', 'passport', 'cpd'],
                }
            });
            console.log('✅ Organization created:', organization.name);
        }

        // Check if admin user already exists
        const existingUser = await prisma.user.findUnique({
            where: { email: ADMIN_EMAIL }
        });

        if (existingUser) {
            console.log('⚠️  Admin user already exists:', ADMIN_EMAIL);

            // Check if user is active
            if (existingUser.status !== 'ACTIVE') {
                console.log('📍 Activating admin user...');
                await prisma.user.update({
                    where: { id: existingUser.id },
                    data: {
                        status: 'ACTIVE',
                        approved_at: new Date(),
                    }
                });
                console.log('✅ Admin user activated');
            }

            // Check if admin role exists
            const hasAdminRole = await prisma.userRole.findFirst({
                where: {
                    user_id: existingUser.id,
                    role: {
                        name: 'admin'
                    }
                }
            });

            if (!hasAdminRole) {
                console.log('📍 Assigning admin role...');
                const adminRole = await prisma.role.findFirst({
                    where: {
                        organization_id: organization.id,
                        name: 'admin'
                    }
                });

                if (adminRole) {
                    await prisma.userRole.create({
                        data: {
                            user_id: existingUser.id,
                            role_id: adminRole.id
                        }
                    });
                    console.log('✅ Admin role assigned');
                }
            }

            console.log('\n✅ Admin user is ready to use:');
            console.log('   Email:', ADMIN_EMAIL);
            console.log('   Password: (use your existing password or reset)');
            return;
        }

        // Create Firebase user
        console.log('📍 Creating Firebase user...');
        let firebaseUser;
        try {
            firebaseUser = await admin.auth().createUser({
                email: ADMIN_EMAIL,
                password: ADMIN_PASSWORD,
                emailVerified: true,
                displayName: ADMIN_NAME,
            });
            console.log('✅ Firebase user created');
        } catch (firebaseError: any) {
            if (firebaseError.code === 'auth/email-already-exists') {
                console.log('📍 Firebase user already exists, fetching...');
                firebaseUser = await admin.auth().getUserByEmail(ADMIN_EMAIL);
            } else {
                throw firebaseError;
            }
        }

        // Create admin role if it doesn't exist
        let adminRole = await prisma.role.findFirst({
            where: {
                organization_id: organization.id,
                name: 'admin'
            }
        });

        if (!adminRole) {
            console.log('📍 Creating admin role...');
            adminRole = await prisma.role.create({
                data: {
                    organization_id: organization.id,
                    name: 'admin',
                    description: 'System administrator with full access',
                    is_system: true
                }
            });

            // Assign all permissions to admin role
            const permissions = await prisma.permission.findMany();
            if (permissions.length > 0) {
                await prisma.rolePermission.createMany({
                    data: permissions.map(p => ({
                        role_id: adminRole!.id,
                        permission_id: p.id
                    }))
                });
                console.log('✅ Admin role created with all permissions');
            }
        }

        // Create user in database
        console.log('📍 Creating admin user in database...');
        const user = await prisma.user.create({
            data: {
                firebase_uid: firebaseUser.uid,
                email: ADMIN_EMAIL,
                full_name: ADMIN_NAME,
                organization_id: organization.id,
                status: 'ACTIVE',
                email_verified: true,
                approved_at: new Date(),
            }
        });

        // Assign admin role
        await prisma.userRole.create({
            data: {
                user_id: user.id,
                role_id: adminRole.id
            }
        });

        console.log('\n✅ First admin user created successfully!');
        console.log('\n📋 Login Credentials:');
        console.log('   Email:', ADMIN_EMAIL);
        console.log('   Password:', ADMIN_PASSWORD);
        console.log('\n⚠️  Please change the password after first login!');
        console.log('\n🔑 This admin can now approve other user registrations.');

    } catch (error) {
        console.error('❌ Error creating admin user:', error);
        throw error;
    } finally {
        await prisma.$disconnect();
    }
}

createFirstAdmin()
    .then(() => {
        console.log('\n✅ Seed completed');
        process.exit(0);
    })
    .catch((error) => {
        console.error('❌ Seed failed:', error);
        process.exit(1);
    });
