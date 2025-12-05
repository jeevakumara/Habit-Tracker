import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import dotenv from 'dotenv';

dotenv.config();

const serviceAccount = {
    type: 'service_account',
    project_id: process.env.FIREBASE_PROJECT_ID,
    private_key: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    client_email: process.env.FIREBASE_CLIENT_EMAIL,
};

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const userId = 'lWKwaToLPHNhf6tsdiTot1yzxHW2';

async function run() {
    const snap = await db.collection('users').doc(userId).collection('habits').get();
    console.log('Habits count:', snap.size);
    snap.forEach(doc => console.log(doc.id, doc.data().name, doc.data().order));
}

run().then(() => process.exit());
