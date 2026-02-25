const axios = require('axios');

const BASE_URL = 'http://localhost:5000/api/auth';
const TEST_USER = {
    name: 'Test User',
    email: `test${Date.now()}@example.com`, // Unique email each run
    password: 'password123'
};

const verifyAuth = async () => {
    try {
        console.log('--- Starting Auth Verification ---');

        // 1. Register
        console.log('\nTesting Registration...');
        const registerRes = await axios.post(`${BASE_URL}/register`, TEST_USER);
        if (registerRes.status === 201 && registerRes.data.token) {
            console.log('✅ Registration Successful');
        } else {
            console.error('❌ Registration Failed', registerRes.data);
            return;
        }

        const token = registerRes.data.token;

        // 2. Login
        console.log('\nTesting Login...');
        const loginRes = await axios.post(`${BASE_URL}/login`, {
            email: TEST_USER.email,
            password: TEST_USER.password
        });
        if (loginRes.status === 200 && loginRes.data.token) {
            console.log('✅ Login Successful');
        } else {
            console.error('❌ Login Failed', loginRes.data);
            return;
        }

        // 3. Get User
        console.log('\nTesting Get User...');
        const getUserRes = await axios.get(`${BASE_URL}/getuser`, {
            headers: { 'auth-token': token }
        });
        if (getUserRes.status === 200 && getUserRes.data.email === TEST_USER.email) {
            console.log('✅ Get User Successful');
            console.log('User Details:', getUserRes.data);
        } else {
            console.error('❌ Get User Failed', getUserRes.data);
            return;
        }

        console.log('\n--- Verification Completed Successfully ---');

    } catch (error) {
        console.error('❌ specific Authentication verification failed:', error.response ? error.response.data : error.message);
    }
};

verifyAuth();
