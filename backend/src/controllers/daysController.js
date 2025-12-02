import { db } from '../config/firebase.js';
import { calculateStreaks } from '../utils/streakCalculator.js';

/**
 * Get specific day's data
 */
export async function getDayData(req, res) {
    try {
        const { userId, dayId } = req.params;

        const dayDoc = await db.collection('users').doc(userId).collection('days').doc(dayId).get();

        if (!dayDoc.exists) {
            return res.status(404).json({ error: 'Day not found' });
        }

        // Get habit details for this day
        const dayData = dayDoc.data();
        const habitDetails = [];

        for (const habitId of dayData.habitsDueForDay || []) {
            const habitDoc = await db.collection('users').doc(userId).collection('habits').doc(habitId).get();
            if (habitDoc.exists) {
                habitDetails.push({
                    habitId: habitDoc.id,
                    ...habitDoc.data(),
                    isCompleted: dayData.completedHabits?.includes(habitId) || false
                });
            }
        }

        res.json({
            ...dayData,
            habits: habitDetails
        });

    } catch (error) {
        console.error('Get day data error:', error);
        res.status(500).json({ error: 'Failed to get day data' });
    }
}

/**
 * Get all days for a user
 */
export async function getAllDays(req, res) {
    try {
        const { userId } = req.params;
        const { limit = 90, offset = 0 } = req.query;

        const daysSnapshot = await db.collection('users').doc(userId).collection('days')
            .orderBy('dayNumber', 'asc')
            .limit(parseInt(limit))
            .offset(parseInt(offset))
            .get();

        const days = [];
        daysSnapshot.forEach(doc => {
            days.push({
                ...doc.data()
            });
        });

        res.json(days);

    } catch (error) {
        console.error('Get all days error:', error);
        res.status(500).json({ error: 'Failed to get days' });
    }
}

/**
 * Update day's habits (mark habit as complete/incomplete)
 */
export async function updateDayHabits(req, res) {
    try {
        const { userId, dayId } = req.params;
        const { habitId, isCompleted } = req.body;

        const dayRef = db.collection('users').doc(userId).collection('days').doc(dayId);
        const dayDoc = await dayRef.get();

        if (!dayDoc.exists) {
            return res.status(404).json({ error: 'Day not found' });
        }

        const dayData = dayDoc.data();
        let completedHabits = dayData.completedHabits || [];

        // Update completed habits array
        if (isCompleted) {
            if (!completedHabits.includes(habitId)) {
                completedHabits.push(habitId);
            }
        } else {
            completedHabits = completedHabits.filter(id => id !== habitId);
        }

        // Calculate completion percentage
        const totalHabits = dayData.totalHabits || dayData.habitsDueForDay?.length || 0;
        const completionPercentage = totalHabits > 0 ? Math.round((completedHabits.length / totalHabits) * 100) : 0;
        const isDayCompleted = completionPercentage === 100;

        // Update day document
        await dayRef.update({
            completedHabits,
            completionPercentage,
            isCompleted: isDayCompleted,
            lastUpdated: new Date()
        });

        // Get all days to recalculate streaks
        const allDaysSnapshot = await db.collection('users').doc(userId).collection('days').get();
        const allDays = [];
        allDaysSnapshot.forEach(doc => allDays.push(doc.data()));

        const { currentStreak, longestStreak } = calculateStreaks(allDays);

        // Calculate total days completed
        const totalDaysCompleted = allDays.filter(d => d.isCompleted && d.completionPercentage === 100).length;

        // Update user document with new streaks
        await db.collection('users').doc(userId).update({
            currentStreak,
            longestStreak,
            totalDaysCompleted,
            lastUpdated: new Date()
        });

        // Update habit completion rate
        const habitSnapshot = await db.collection('users').doc(userId).collection('habits').doc(habitId).get();
        if (habitSnapshot.exists) {
            const daysWithHabit = allDays.filter(d => d.habitsDueForDay?.includes(habitId));
            const completedDaysWithHabit = daysWithHabit.filter(d => d.completedHabits?.includes(habitId));
            const habitCompletionRate = daysWithHabit.length > 0
                ? Math.round((completedDaysWithHabit.length / daysWithHabit.length) * 100)
                : 0;

            await db.collection('users').doc(userId).collection('habits').doc(habitId).update({
                completionRate: habitCompletionRate
            });
        }

        res.json({
            message: 'Day updated successfully',
            completionPercentage,
            isCompleted: isDayCompleted,
            currentStreak,
            longestStreak,
            completedHabits
        });

    } catch (error) {
        console.error('Update day habits error:', error);
        res.status(500).json({ error: 'Failed to update day' });
    }
}

/**
 * Add or update notes for a day
 */
export async function updateDayNotes(req, res) {
    try {
        const { userId, dayId } = req.params;
        const { notes } = req.body;

        await db.collection('users').doc(userId).collection('days').doc(dayId).update({
            notes: notes || '',
            lastUpdated: new Date()
        });

        res.json({ message: 'Notes updated successfully' });

    } catch (error) {
        console.error('Update notes error:', error);
        res.status(500).json({ error: 'Failed to update notes' });
    }
}
