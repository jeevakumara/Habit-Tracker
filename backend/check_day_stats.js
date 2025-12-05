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

async function checkDayStats() {
    console.log('🔍 Checking day stats for Dec 5...');

    try {
        const daysSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('days')
            .where('dateLabel', '==', 'Dec 5')
            .get();

        if (daysSnapshot.empty) {
            console.log('No day found for Dec 5');
            // Try identifying by date if dateLabel fails (just in case)
            // But from screenshot it is Dec 5
            return;
        }

        daysSnapshot.forEach(doc => {
            const data = doc.data();
            console.log('--------------------------------');
            console.log(`Day ID: ${doc.id}`);
            console.log(`Date Label: ${data.dateLabel}`);
            console.log(`Completion %: ${data.completionPercentage}`);
            console.log(`Total Habits (stored): ${data.totalHabits}`);
            console.log(`Completed Count (stored): ${data.completedHabitsCount}`);
            console.log(`Completed Habits Array Length: ${data.completedHabits ? data.completedHabits.length : 'N/A'}`);
            console.log(`Habits Due Array Length: ${data.habitsDueForDay ? data.habitsDueForDay.length : 'N/A'}`);

            if (data.completedHabits) {
                console.log('Completed IDs:', data.completedHabits);
            }
        });

    } catch (error) {
        console.error('❌ Check failed:', error);
    }
}

checkDayStats().then(() => process.exit());
