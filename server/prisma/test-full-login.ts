import axios from 'axios';
import { PrismaClient } from '@prisma/client';
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';

const prisma = new PrismaClient();
const BASE_URL = 'http://localhost:3001/api/v1';

// Firebase config (from your .env or frontend)
const firebaseConfig = {
    apiKey: "AIzaSyCwKE3a2TvQ-xCMSnAZK7_ZI6C9-4MMgZg",
    authDomain: "aafcareconnect.firebaseapp.com",
    projectId: "aafcareconnect",
    storageBucket: "aafcareconnect.firebasestorage.app",
    messagingSenderId: "589044768684",
    appId: "1:589044768684:web:c42e2efb70e681bbfb7fe2",
    measurementId: "G-YG8W0HTWHV"
};

async function testFullLoginFlow() {
    console.log('🧪 Testing FULL Login Flow (Like Real User)\n');

    try {
        // Step 1: Login with Firebase
        console.log('1️⃣ Logging in with Firebase...');
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);

        const userCredential = await signInWithEmailAndPassword(auth, 'admin@aafcareconnect.com', 'Admin@123');
        const firebaseToken = await userCredential.user.getIdToken();
        console.log('✓ Got Firebase token');

        // Step 2: Call backend login endpoint
        console.log('\n2️⃣ Calling backend /auth/social-login...');
        const loginResponse = await axios.post(`${BASE_URL}/auth/social-login`, {
            idToken: firebaseToken
        });

        const { access_token, refresh_token, user } = loginResponse.data.data;
        console.log('✓ Login successful!');
        console.log(`   User: ${user.email}`);
        console.log(`   Access Token: ${access_token.substring(0, 50)}...`);
        console.log(`   Refresh Token: ${refresh_token.substring(0, 50)}...`);

        // Step 3: Test API with the new token
        console.log('\n3️⃣ Testing GET /courses with new token...');
        const coursesResponse = await axios.get(`${BASE_URL}/courses`, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        console.log(`✓ Success! Got ${coursesResponse.data.data?.length || 0} courses`);

        // Step 4: Test creating a course
        console.log('\n4️⃣ Testing POST /courses...');
        const createResponse = await axios.post(`${BASE_URL}/courses`, {
            title: 'Real Login Test Course',
            description: 'Created after proper login flow',
            category: 'SAFEGUARDING',
            level: 'FOUNDATION'
        }, {
            headers: { Authorization: `Bearer ${access_token}` }
        });
        console.log(`✓ Success! Created course: ${createResponse.data.data?.title}`);

        console.log('\n✅ FULL LOGIN FLOW WORKS PERFECTLY!');
        console.log('\n📋 Solution for frontend:');
        console.log('   1. User needs to LOGOUT completely');
        console.log('   2. Clear localStorage (old tokens)');
        console.log('   3. LOGIN again');
        console.log('   4. New JWT tokens will be generated with valid sessions');

    } catch (error: any) {
        console.log(`\n❌ Failed at step: ${error.message}`);
        if (error.response) {
            console.log(`   Status: ${error.response.status}`);
            console.log(`   Error: ${error.response.data?.error || error.response.statusText}`);
            console.log(`   Code: ${error.response.data?.code}`);
        }
    } finally {
        await prisma.$disconnect();
    }
}

testFullLoginFlow().catch(console.error);
