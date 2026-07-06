import { PrismaClient } from '@prisma/client';
import axios from 'axios';
import crypto from 'crypto';
import { tokenService } from '../src/shared/providers/token/jwt.token.service';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3001/api/v1';

async function createProperSessionAndTest() {
    console.log('🧪 Creating Proper Session and Testing API\n');

    try {
        // Get admin user
        const adminUser = await prisma.user.findUnique({
            where: { email: 'admin@aafcareconnect.com' },
            include: {
                user_roles: {
                    include: { role: true }
                }
            }
        });

        if (!adminUser) {
            console.log('❌ Admin user not found!');
            return;
        }

        // Create a real session in the database
        console.log('1️⃣ Creating session in database...');
        const familyId = crypto.randomUUID();
        const rawRefreshToken = tokenService.generateRefreshToken();
        const hashedToken = tokenService.hashToken(rawRefreshToken);

        const session = await prisma.userSession.create({
            data: {
                user_id: adminUser.id,
                family_id: familyId,
                refresh_token_hash: hashedToken,
                ip_address: '127.0.0.1',
                browser: 'test-script',
                expires_at: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
            }
        });

        console.log(`✓ Session created: ${session.id}`);

        // Generate proper JWT token
        console.log('\n2️⃣ Generating JWT token with valid session...');
        const accessToken = tokenService.generateAccessToken({
            sub: adminUser.id,
            org: adminUser.organization_id,
            role: adminUser.user_roles[0]?.role.name || 'admin',
            sid: familyId,
            session_version: adminUser.session_version,
        });

        console.log('✓ JWT token generated');
        console.log(`Token: ${accessToken.substring(0, 50)}...`);

        // Test GET courses
        console.log('\n3️⃣ Testing GET /courses...');
        const coursesResponse = await axios.get(`${BASE_URL}/courses`, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log(`✓ Success! Got ${coursesResponse.data.data?.length || 0} courses`);

        // Test POST courses
        console.log('\n4️⃣ Testing POST /courses...');
        const createResponse = await axios.post(`${BASE_URL}/courses`, {
            title: 'Session Test Course',
            description: 'Created with proper session',
            category: 'SAFEGUARDING',
            level: 'FOUNDATION'
        }, {
            headers: { Authorization: `Bearer ${accessToken}` }
        });
        console.log(`✓ Success! Created course: ${createResponse.data.data?.title}`);
        console.log(`   Course ID: ${createResponse.data.data?.id}`);

        // Test adding a section
        const courseId = createResponse.data.data?.id;
        if (courseId) {
            console.log('\n5️⃣ Testing POST /courses/:id/sections...');
            const sectionResponse = await axios.post(`${BASE_URL}/courses/${courseId}/sections`, {
                title: 'Test Section',
                type: 'VIDEO',
                order_index: 1
            }, {
                headers: { Authorization: `Bearer ${accessToken}` }
            });
            console.log(`✓ Success! Added section: ${sectionResponse.data.data?.title}`);
        }

        console.log('\n✅ ALL API TESTS PASSED!');
        console.log('\n🎯 ROOT CAUSE IDENTIFIED:');
        console.log('   - Backend authentication is WORKING CORRECTLY');
        console.log('   - Users have OLD tokens in localStorage from before JWT migration');
        console.log('   - Old tokens don\'t have valid sessions in database');
        console.log('');
        console.log('💡 SOLUTION:');
        console.log('   Users must LOGOUT and LOGIN again to get fresh JWT tokens');
        console.log('   with valid session IDs.');

    } catch (error: any) {
        console.log(`\n❌ Test failed: ${error.message}`);
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Error: ${error.response.data?.error || error.response.statusText}`);
            console.log(`   Code: ${error.response.data?.code}`);
            console.log(`   Details:`, error.response.data);
        }
    } finally {
        await prisma.$disconnect();
    }
}

createProperSessionAndTest().catch(console.error);
