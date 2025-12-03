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

const userId = 'lWKwaToLPHNhf6tsdiTot1yzxHW2'; // Your user ID

async function fixDatabase() {
    console.log('🔧 Starting database fix...\n');

    try {
        // Step 1: Get all CURRENT habits
        const habitsSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('habits')
            .get();

        const currentHabitIds = habitsSnapshot.docs.map(doc => doc.id);

        console.log(`✅ Found ${currentHabitIds.length} current habits:`);
        habitsSnapshot.docs.forEach(doc => {
            const data = doc.data();
            console.log(`  - ${doc.id}: ${data.name}`);
        });

        console.log('\n📅 Updating all days...\n');

        // Step 2: Update ALL days with current habit IDs
        const daysSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('days')
            .get();

        let fixedCount = 0;
        const batch = db.batch();

        for (const dayDoc of daysSnapshot.docs) {
            const dayRef = db.collection('users').doc(userId).collection('days').doc(dayDoc.id);
            const dayData = dayDoc.data();

            // Filter out invalid habits from completedHabits
            const validCompletedHabits = (dayData.completedHabits || [])
                .filter(habitId => currentHabitIds.includes(habitId));

            // Calculate new completion
            const totalHabits = currentHabitIds.length;
            const completedCount = validCompletedHabits.length;
            const completionPercentage = totalHabits > 0
                ? Math.round((completedCount / totalHabits) * 100)
                : 0;

            batch.update(dayRef, {
                habitsDueForDay: currentHabitIds, // All current habits
                completedHabits: validCompletedHabits,
                totalHabits: totalHabits,
                completedHabitsCount: completedCount,
                completionPercentage: completionPercentage,
                updatedAt: new Date().toISOString()
            });

            fixedCount++;
        }

        await batch.commit();

        console.log(`✅ Fixed ${fixedCount} days successfully!\n`);
        console.log('🎉 Database repair complete!');
        console.log('\n📋 Summary:');
        console.log(`  - Current habits: ${currentHabitIds.length}`);
        console.log(`  - Days updated: ${fixedCount}`);
        console.log(`  - All days now reference valid habits only`);

    } catch (error) {
        console.error('❌ Fix failed:', error);
    }
}

fixDatabase();
