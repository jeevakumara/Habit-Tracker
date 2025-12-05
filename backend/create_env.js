import fs from 'fs';
const content = `PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Firebase Admin SDK
FIREBASE_PROJECT_ID=habit-tracker-253da
FIREBASE_PRIVATE_KEY_ID=placeholder_id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\nPLACEHOLDER_KEY\\n-----END PRIVATE KEY-----\\n"
FIREBASE_CLIENT_EMAIL=placeholder_email
FIREBASE_CLIENT_ID=placeholder_client_id

# Challenge Dates
CHALLENGE_START_DATE=2025-12-01
CHALLENGE_END_DATE=2026-02-28
`;
fs.writeFileSync('.env', content);
console.log('Created backend/.env');
