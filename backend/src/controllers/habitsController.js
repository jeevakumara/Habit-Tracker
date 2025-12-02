import { db } from '../config/firebase.js';
import { getCurrentDayNumber } from '../utils/dateUtils.js';

/**
 * Get all habits for a user
 */
export async function getAllHabits(req, res) {
    try {
        const { userId } = req.params;

        const habitsSnapshot = await db.collection('users').doc(userId).collection('habits')
            .where('isActive', '==', true)
            .get();

        const habits = [];
        habitsSnapshot.forEach(doc => {
            habits.push({
                habitId: doc.id,
                ...doc.data()
            });
        });

        res.json(habits);

    } catch (error) {
        console.error('Get habits error:', error);
        res.status(500).json({ error: 'Failed to get habits' });
    }
}

/**
 * Add new habit
 */
export async function addHabit(req, res) {
    try {
        const { userId } = req.params;
        const { name, category, color } = req.body;

        if (!name) {
            return res.status(400).json({ error: 'Habit name required' });
        }

        // Add habit to habits collection
        const habitRef = await db.collection('users').doc(userId).collection('habits').add({
            name,
            category: category || 'habits',
            color: color || '#6B7280',
            createdAt: new Date(),
            isActive: true,
            completionRate: 0,
            frequency: 'daily'
        });

        // Get current day number to determine which days to update
        const currentDayNumber = getCurrentDayNumber();

        if (currentDayNumber) {
            // Update all incomplete days (from current day onwards)
            const daysSnapshot = await db.collection('users').doc(userId).collection('days')
                .where('dayNumber', '>=', currentDayNumber)
                .get();

            const batch = db.batch();

            daysSnapshot.forEach(doc => {
                const dayData = doc.data();

                // Only update if day is not fully completed
                if (!dayData.isCompleted || dayData.completionPercentage < 100) {
                    const updatedHabitsDue = [...(dayData.habitsDueForDay || []), habitRef.id];
                    const updatedTotalHabits = updatedHabitsDue.length;

                    // Recalculate completion percentage
                    const completedCount = dayData.completedHabits?.length || 0;
                    const newCompletionPercentage = Math.round((completedCount / updatedTotalHabits) * 100);

                    batch.update(doc.ref, {
                        habitsDueForDay: updatedHabitsDue,
                        totalHabits: updatedTotalHabits,
                        completionPercentage: newCompletionPercentage,
                        isCompleted: newCompletionPercentage === 100
                    });
                }
            });

            await batch.commit();
        }

        res.status(201).json({
            message: 'Habit added successfully',
            habitId: habitRef.id,
            habit: {
                habitId: habitRef.id,
                name,
                category: category || 'habits',
                color: color || '#6B7280',
                isActive: true
            }
        });

    } catch (error) {
        console.error('Add habit error:', error);
        res.status(500).json({ error: 'Failed to add habit' });
    }
}

/**
 * Update habit
 */
export async function updateHabit(req, res) {
    try {
        const { userId, habitId } = req.params;
        const updates = req.body;

        // Remove fields that shouldn't be updated directly
        delete updates.habitId;
        delete updates.createdAt;
        delete updates.completionRate;

        await db.collection('users').doc(userId).collection('habits').doc(habitId).update({
            ...updates,
            updatedAt: new Date()
        });

        res.json({ message: 'Habit updated successfully' });

    } catch (error) {
        console.error('Update habit error:', error);
        res.status(500).json({ error: 'Failed to update habit' });
    }
}

/**
 * Delete habit (soft delete)
 */
export async function deleteHabit(req, res) {
    try {
        const { userId, habitId } = req.params;

        await db.collection('users').doc(userId).collection('habits').doc(habitId).update({
            isActive: false,
            deletedAt: new Date()
        });

        res.json({ message: 'Habit deleted successfully' });

    } catch (error) {
        console.error('Delete habit error:', error);
        res.status(500).json({ error: 'Failed to delete habit' });
    }
}
