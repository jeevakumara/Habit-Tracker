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

const DEFAULT_HABITS = [
    { name: 'Meditation', icon: '🧘', order: 1 },
    { name: 'Breath Exercise', icon: '🌬️', order: 2 },
    { name: 'Book (Reading)', icon: '📚', order: 3 },
    { name: 'Physical Exercise', icon: '🏃', order: 4 },
    { name: 'OOPs Project', icon: '💻', order: 5 },
    { name: 'Data Structures & Algorithms', icon: '🧮', order: 6 },
    { name: 'GATE CSE Preparation', icon: '📖', order: 7 },
    { name: 'Moisturizer (2x daily)', icon: '🧴', order: 8 },
    { name: 'Inhaler (3x daily)', icon: '💨', order: 9 },
    { name: '3 Liters of Water', icon: '💧', order: 10 },
    { name: 'Startup Work', icon: '🚀', order: 11 }
];

async function seedHabits() {
    console.log('🌱 Seeding habits for user:', userId);

    try {
        // Check existing habits
        const existing = await db.collection('users').doc(userId).collection('habits').get();

        if (existing.size > 0) {
            console.log(`⚠️  User already has ${existing.size} habits. Skipping seed.`);
            console.log('If you want to re-seed, delete existing habits first.');
            return;
        }

        // Create habits
        const habitIds = [];
        for (const habit of DEFAULT_HABITS) {
            const docRef = await db.collection('users').doc(userId).collection('habits').add({
                ...habit,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });
            habitIds.push(docRef.id);
            console.log(`✅ Created habit: ${habit.name} (${docRef.id})`);
        }

        // Update all days to reference these habits
        console.log('\n📅 Updating days with new habit IDs...');

        const daysSnap = await db.collection('users').doc(userId).collection('days').get();
        const batch = db.batch();

        daysSnap.docs.forEach(dayDoc => {
            const ref = db.collection('users').doc(userId).collection('days').doc(dayDoc.id);
            batch.update(ref, {
                habitsDueForDay: habitIds,
                completedHabits: [],
                totalHabits: habitIds.length,
                completedHabitsCount: 0,
                completionPercentage: 0,
                updatedAt: new Date().toISOString()
            });
        });

        await batch.commit();

        console.log(`\n✅ Seeded ${DEFAULT_HABITS.length} habits successfully!`);
        console.log(`✅ Updated ${daysSnap.size} days with habit references.`);
        console.log('\n🎉 Database is ready! Refresh your app.');

    } catch (error) {
        console.error('❌ Seed failed:', error);
    }
}

seedHabits().then(() => process.exit());
