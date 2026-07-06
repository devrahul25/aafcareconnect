import axios from 'axios';

const BASE_URL = 'http://localhost:3001/api/v1';

// Token from diagnostic script
const ADMIN_TOKEN = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiI0YmFmYWExMi02NzkwLTQ1NmItYmIzOC02MTI3NTdjYWVjZjAiLCJvcmciOiIzMzVkMThmNi1kMTJkLTQyMDQtOTUyNS05NWZiYjZlN2Y5ZWYiLCJyb2xlIjoiYWRtaW4iLCJzaWQiOiJ0ZXN0LXNlc3Npb24taWQiLCJzZXNzaW9uX3ZlcnNpb24iOjEsImp0aSI6Ijc5NGExOWIyLTMyNTYtNDA3Ni05YjMxLWEwMWJmOThiNWNiMyIsImlhdCI6MTc4MzMzOTUxOSwiZXhwIjoxNzgzOTQ0MzE5fQ.WlEtrlBbnO7WxE1bhhDNDPfBEXeO0rRO2xHzPJ_Ak70';

async function testAPI() {
    console.log('🧪 Testing API Endpoints\n');

    try {
        // Test 1: List courses
        console.log('1️⃣ Testing GET /courses...');
        const coursesResponse = await axios.get(`${BASE_URL}/courses`, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log(`✓ Success! Got ${coursesResponse.data.data?.length || 0} courses`);
        console.log(`   Status: ${coursesResponse.status}`);
    } catch (error: any) {
        console.log(`❌ Failed: ${error.response?.status} ${error.response?.statusText}`);
        console.log(`   Error: ${error.response?.data?.error || error.message}`);
        console.log(`   Code: ${error.response?.data?.code}`);
    }

    try {
        // Test 2: Create a course
        console.log('\n2️⃣ Testing POST /courses...');
        const createResponse = await axios.post(`${BASE_URL}/courses`, {
            title: 'Test Course from Script',
            description: 'Testing API authentication',
            category: 'SAFEGUARDING',
            level: 'FOUNDATION'
        }, {
            headers: { Authorization: `Bearer ${ADMIN_TOKEN}` }
        });
        console.log(`✓ Success! Created course ID: ${createResponse.data.data?.id}`);
        console.log(`   Status: ${createResponse.status}`);
    } catch (error: any) {
        console.log(`❌ Failed: ${error.response?.status} ${error.response?.statusText}`);
        console.log(`   Error: ${error.response?.data?.error || error.message}`);
        console.log(`   Code: ${error.response?.data?.code}`);
    }

    console.log('\n✅ API Test Complete');
}

testAPI().catch(console.error);
