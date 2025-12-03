import { db } from '../config/firebase.js';

export async function getHabits(req, res) {
    try {
        const { userId } = req.params;
        console.log('🔍 getHabits REQUEST:', { url: req.url, params: req.params, userId });

        const habitsSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('habits')
            .orderBy('order', 'asc')
            .get();

        console.log(`🔍 getHabits: userId=${userId}, found=${habitsSnapshot.size}`);

        const habits = habitsSnapshot.docs.map(doc => ({
            id: doc.id,
            habitId: doc.id, // ✅ Add habitId for compatibility
            ...doc.data()
        }));

        // ✅ CRITICAL FIX: Return proper format
        res.json({
            success: true,
            habits: habits,
            count: habits.length
        });
    } catch (error) {
        console.error('Get habits error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export async function createHabit(req, res) {
    try {
        const { userId } = req.params;
        const habitData = req.body;

        const habitRef = await db
            .collection('users')
            .doc(userId)
            .collection('habits')
            .add({
                ...habitData,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            });

        const newHabit = await habitRef.get();

        // ✅ CRITICAL FIX: Add success flag
        res.status(201).json({
            success: true,
            habit: {
                id: habitRef.id,
                ...newHabit.data()
            }
        });
    } catch (error) {
        console.error('Create habit error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export async function updateHabit(req, res) {
    try {
        const { userId, habitId } = req.params;
        const updates = req.body;

        const habitRef = db
            .collection('users')
            .doc(userId)
            .collection('habits')
            .doc(habitId);

        const habitDoc = await habitRef.get();

        if (!habitDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Habit not found'
            });
        }

        await habitRef.update({
            ...updates,
            updatedAt: new Date().toISOString()
        });

        const updatedHabit = await habitRef.get();

        // ✅ CRITICAL FIX: Add success flag
        res.json({
            success: true,
            habit: {
                id: habitRef.id,
                ...updatedHabit.data()
            }
        });
    } catch (error) {
        console.error('Update habit error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export async function deleteHabit(req, res) {
    try {
        const { userId, habitId } = req.params;

        const habitRef = db
            .collection('users')
            .doc(userId)
            .collection('habits')
            .doc(habitId);

        const habitDoc = await habitRef.get();

        if (!habitDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Habit not found'
            });
        }

        await habitRef.delete();

        // ✅ CRITICAL FIX: Add success flag
        res.json({
            success: true,
            message: 'Habit deleted successfully'
        });
    } catch (error) {
        console.error('Delete habit error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}
