// No imports needed for Node 18+

async function registerUser() {
    try {
        console.log('Attempting to register user...');
        const response = await fetch('http://localhost:5000/api/auth/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: 'demo2@example.com', // Changed email to avoid conflict if previous one partially succeeded
                password: 'password123',
                displayName: 'Demo User'
            })
        });

        const data = await response.json();
        console.log('Response Status:', response.status);
        console.log('Response Data:', JSON.stringify(data, null, 2));

        if (response.ok) {
            console.log('\nSUCCESS! Use this User ID in your frontend:');
            console.log(data.userId);
        } else {
            console.log('Registration failed.');
        }
    } catch (error) {
        console.error('Error:', error);
    }
}

registerUser();
