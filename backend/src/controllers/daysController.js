import { db } from '../config/firebase.js';

export async function getAllDays(req, res) {
    try {
        const { userId } = req.params;

        console.log('📅 Fetching all days for user:', userId);

        // Fetch all days
        const daysSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('days')
            .orderBy('date', 'asc')
            .get();

        // Fetch all habits ONCE (efficient)
        const habitsSnapshot = await db
            .collection('users')
            .doc(userId)
            .collection('habits')
            .orderBy('order', 'asc')
            .get();

        // Create habits map for O(1) lookup
        const habitsMap = new Map();
        habitsSnapshot.docs.forEach(doc => {
            habitsMap.set(doc.id, {
                id: doc.id,
                habitId: doc.id,
                ...doc.data()
            });
        });

        console.log(`✅ Found ${habitsSnapshot.size} habits`);
        console.log(`✅ Found ${daysSnapshot.size} days`);

        // Transform days with populated habits
        const days = daysSnapshot.docs.map(doc => {
            const dayData = doc.data();

            // Get all habit IDs that were due for this day
            const habitsDueForDay = dayData.habitsDueForDay || [];
            const completedHabits = dayData.completedHabits || [];

            // Build habits array with completion status
            const dayHabits = habitsDueForDay.map(habitId => {
                const habit = habitsMap.get(habitId);

                if (!habit) {
                    console.warn(`⚠️ Habit ${habitId} not found for day ${doc.id}`);
                    return null;
                }

                return {
                    ...habit,
                    isCompleted: completedHabits.includes(habitId)
                };
            }).filter(Boolean); // Remove null entries

            // Calculate completion percentage
            const totalHabits = habitsDueForDay.length;
            const completedCount = completedHabits.length;
            const completionPercentage = totalHabits > 0
                ? Math.round((completedCount / totalHabits) * 100)
                : 0;

            return {
                id: doc.id,
                dayId: doc.id,
                dayNumber: dayData.dayNumber,
                date: dayData.date,
                dateLabel: dayData.dateLabel,
                habits: dayHabits, // ✅ CRITICAL: Populated habits array
                habitsDueForDay: habitsDueForDay,
                completedHabits: completedHabits,
                completionPercentage: completionPercentage,
                totalHabits: totalHabits,
                completedHabitsCount: completedCount,
                isCompleted: completionPercentage === 100,
                notes: dayData.notes || '',
                createdAt: dayData.createdAt,
                updatedAt: dayData.updatedAt
            };
        });

        console.log(`✅ Returning ${days.length} days with populated habits`);

        res.json({
            success: true,
            days: days,
            count: days.length,
            totalHabits: habitsSnapshot.size
        });

    } catch (error) {
        console.error('❌ Get all days error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export async function getDayById(req, res) {
    try {
        const { userId, dayId } = req.params;

        const dayDoc = await db
            .collection('users')
            .doc(userId)
            .collection('days')
            .doc(dayId)
            .get();

        if (!dayDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Day not found'
            });
        }

        // ✅ CRITICAL FIX: Add success flag
        res.json({
            success: true,
            day: {
                id: dayDoc.id,
                ...dayDoc.data()
            }
        });
    } catch (error) {
        console.error('Get day error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export async function updateDayHabits(req, res) {
    try {
        const { userId, dayId } = req.params;
        const { habits } = req.body; // habits is { habitId: true/false, ... }

        console.log('📝 Updating habits for day:', dayId);

        if (!dayId || dayId === ':dayId' || dayId === 'undefined') {
            return res.status(400).json({
                success: false,
                error: 'Invalid day ID provided'
            });
        }

        const dayRef = db.collection('users').doc(userId).collection('days').doc(dayId);
        const dayDoc = await dayRef.get();

        if (!dayDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Day not found'
            });
        }

        const dayData = dayDoc.data();

        // Extract completed habit IDs
        const completedHabits = Object.entries(habits)
            .filter(([_, completed]) => completed === true)
            .map(([habitId]) => habitId);

        // Get all habit IDs that should be due for this day
        const habitsDueForDay = dayData.habitsDueForDay || Object.keys(habits);

        // Calculate completion percentage
        const totalHabits = habitsDueForDay.length;
        const completedCount = completedHabits.length;
        const completionPercentage = totalHabits > 0
            ? Math.round((completedCount / totalHabits) * 100)
            : 0;

        // Update day document
        await dayRef.update({
            completedHabits: completedHabits,
            completedHabitsCount: completedCount,
            completionPercentage: completionPercentage,
            totalHabits: totalHabits,
            updatedAt: new Date().toISOString()
        });

        console.log(`✅ Day updated: ${completedCount}/${totalHabits} habits (${completionPercentage}%)`);

        // Check if this completed a streak
        if (completionPercentage === 100) {
            await updateUserStreak(userId, dayId);
        }

        res.json({
            success: true,
            message: 'Habits updated successfully',
            completionPercentage,
            completedCount,
            totalHabits
        });
    } catch (error) {
        console.error('❌ Update day habits error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

export async function updateDayNotes(req, res) {
    try {
        const { userId, dayId } = req.params;
        const { notes } = req.body;

        const dayRef = db.collection('users').doc(userId).collection('days').doc(dayId);
        const dayDoc = await dayRef.get();

        if (!dayDoc.exists) {
            return res.status(404).json({
                success: false,
                error: 'Day not found'
            });
        }

        await dayRef.update({
            notes: notes,
            updatedAt: new Date().toISOString()
        });

        // ✅ CRITICAL FIX: Add success flag
        res.json({
            success: true,
            message: 'Notes updated successfully'
        });
    } catch (error) {
        console.error('Update day notes error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
}

// Helper function to update streak
async function updateUserStreak(userId, completedDayId) {
    try {
        const userRef = db.collection('users').doc(userId);
        const userDoc = await userRef.get();

        if (!userDoc.exists) return;

        const userData = userDoc.data();
        const currentStreak = userData.currentStreak || 0;
        const longestStreak = userData.longestStreak || 0;

        const newStreak = currentStreak + 1;
        const newLongest = Math.max(newStreak, longestStreak);

        await userRef.update({
            currentStreak: newStreak,
            longestStreak: newLongest,
            lastCompletedDay: completedDayId,
            updatedAt: new Date().toISOString()
        });

        console.log(`🔥 Streak updated: ${newStreak} (longest: ${newLongest})`);
    } catch (error) {
        console.error('❌ Failed to update streak:', error);
    }
}