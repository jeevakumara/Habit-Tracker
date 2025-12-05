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

async function fixHabitsOrder() {
    console.log('🔧 Fixing habits order for user:', userId);

    try {
        const habitsSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('habits')
            .get();

        if (habitsSnapshot.empty) {
            console.log('No habits found.');
            return;
        }

        const batch = db.batch();
        let count = 0;

        habitsSnapshot.docs.forEach((doc, index) => {
            const data = doc.data();
            if (data.order === undefined) {
                const habitRef = db
                    .collection('users')
                    .doc(userId)
                    .collection('habits')
                    .doc(doc.id);

                batch.update(habitRef, {
                    order: index + 1,
                    updatedAt: new Date().toISOString()
                });
                count++;
                console.log(`Prepared update for: ${data.name} -> order: ${index + 1}`);
            }
        });

        if (count > 0) {
            await batch.commit();
            console.log(`✅ Successfully updated ${count} habits with order!`);
        } else {
            console.log('✅ All habits already have order field.');
        }

    } catch (error) {
        console.error('❌ Fix failed:', error);
    }
}

fixHabitsOrder().then(() => process.exit());
