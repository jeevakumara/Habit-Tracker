import { db } from '../config/firebase.js';
import { calculateStreaks } from '../utils/streakCalculator.js';

/**
 * Get analytics summary
 */
export async function getAnalyticsSummary(req, res) {
    try {
        const { userId } = req.params;

        // Get user document
        const userDoc = await db.collection('users').doc(userId).get();
        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        const userData = userDoc.data();

        // Get all days
        const daysSnapshot = await db.collection('users').doc(userId).collection('days').get();
        const days = [];
        daysSnapshot.forEach(doc => days.push(doc.data()));

        // Calculate overall completion
        const totalDays = 90;
        const completedDays = days.filter(d => d.isCompleted && d.completionPercentage === 100).length;
        const overallCompletion = Math.round((completedDays / totalDays) * 100);

        // Days remaining
        const today = new Date();
        const endDate = new Date('2026-02-28');
        const daysRemaining = Math.max(0, Math.ceil((endDate - today) / (1000 * 60 * 60 * 24)));

        res.json({
            currentStreak: userData.currentStreak || 0,
            longestStreak: userData.longestStreak || 0,
            totalDaysCompleted: completedDays,
            overallCompletion,
            daysRemaining,
            totalDays
        });

    } catch (error) {
        console.error('Get analytics summary error:', error);
        res.status(500).json({ error: 'Failed to get analytics summary' });
    }
}

/**
 * Get monthly breakdown
 */
export async function getMonthlyBreakdown(req, res) {
    try {
        const { userId, month } = req.params; // month format: YYYY-MM

        const daysSnapshot = await db.collection('users').doc(userId).collection('days')
            .where('dayId', '>=', `${month}-01`)
            .where('dayId', '<=', `${month}-31`)
            .get();

        const days = [];
        daysSnapshot.forEach(doc => days.push(doc.data()));

        const totalDaysInMonth = days.length;
        const completedDays = days.filter(d => d.isCompleted && d.completionPercentage === 100).length;
        const completionPercentage = totalDaysInMonth > 0
            ? Math.round((completedDays / totalDaysInMonth) * 100)
            : 0;

        // Calculate average habit completion
        const totalCompletionSum = days.reduce((sum, day) => sum + (day.completionPercentage || 0), 0);
        const averageHabitCompletion = totalDaysInMonth > 0
            ? Math.round(totalCompletionSum / totalDaysInMonth)
            : 0;

        res.json({
            month,
            totalDaysInMonth,
            completedDays,
            completionPercentage,
            averageHabitCompletion,
            days
        });

    } catch (error) {
        console.error('Get monthly breakdown error:', error);
        res.status(500).json({ error: 'Failed to get monthly breakdown' });
    }
}

/**
 * Get habit-specific analytics
 */
export async function getHabitAnalytics(req, res) {
    try {
        const { userId, habitId } = req.params;

        // Get habit details
        const habitDoc = await db.collection('users').doc(userId).collection('habits').doc(habitId).get();
        if (!habitDoc.exists) {
            return res.status(404).json({ error: 'Habit not found' });
        }

        const habitData = habitDoc.data();

        // Get all days that include this habit
        const daysSnapshot = await db.collection('users').doc(userId).collection('days').get();
        const allDays = [];
        daysSnapshot.forEach(doc => allDays.push(doc.data()));

        const daysWithHabit = allDays.filter(d => d.habitsDueForDay?.includes(habitId));
        const completedDaysWithHabit = daysWithHabit.filter(d => d.completedHabits?.includes(habitId));

        const completionRate = daysWithHabit.length > 0
            ? Math.round((completedDaysWithHabit.length / daysWithHabit.length) * 100)
            : 0;

        // Calculate consistency (how often it's completed on days where all habits are complete)
        const fullyCompleteDays = daysWithHabit.filter(d => d.isCompleted && d.completionPercentage === 100);
        const habitCompletedOnFullDays = fullyCompleteDays.filter(d => d.completedHabits?.includes(habitId));
        const consistencyScore = fullyCompleteDays.length > 0
            ? Math.round((habitCompletedOnFullDays.length / fullyCompleteDays.length) * 100)
            : 0;

        res.json({
            habitId,
            name: habitData.name,
            category: habitData.category,
            totalDaysTracked: daysWithHabit.length,
            completedDays: completedDaysWithHabit.length,
            completionRate,
            consistencyScore,
            color: habitData.color
        });

    } catch (error) {
        console.error('Get habit analytics error:', error);
        res.status(500).json({ error: 'Failed to get habit analytics' });
    }
}

/**
 * Get all chart data formatted for frontend
 */
export async function getChartData(req, res) {
    try {
        const { userId } = req.params;

        // Get all habits
        const habitsSnapshot = await db.collection('users').doc(userId).collection('habits')
            .where('isActive', '==', true)
            .get();

        const habits = [];
        habitsSnapshot.forEach(doc => habits.push({ habitId: doc.id, ...doc.data() }));

        // Get all days
        const daysSnapshot = await db.collection('users').doc(userId).collection('days')
            .orderBy('dayNumber', 'asc')
            .get();

        const days = [];
        daysSnapshot.forEach(doc => days.push(doc.data()));

        // Bar Chart: Habit Performance
        const habitPerformance = habits.map(habit => {
            const daysWithHabit = days.filter(d => d.habitsDueForDay?.includes(habit.habitId));
            const completedDaysWithHabit = daysWithHabit.filter(d => d.completedHabits?.includes(habit.habitId));
            const rate = daysWithHabit.length > 0
                ? Math.round((completedDaysWithHabit.length / daysWithHabit.length) * 100)
                : 0;

            return {
                name: habit.name,
                completionRate: rate,
                color: habit.color
            };
        });

        // Line Chart: Daily Progress
        const dailyProgress = days.map(day => ({
            day: day.dayNumber,
            dateLabel: day.dateLabel,
            completionPercentage: day.completionPercentage || 0
        }));

        // Pie Chart: This Week's Breakdown (last 7 days)
        const last7Days = days.slice(-7);
        const weeklyStats = {
            completed: last7Days.filter(d => d.isCompleted && d.completionPercentage === 100).length,
            partial: last7Days.filter(d => d.completionPercentage > 0 && d.completionPercentage < 100).length,
            notStarted: last7Days.filter(d => d.completionPercentage === 0).length
        };

        // Heatmap: Last 30 days intensity
        const last30Days = days.slice(-30).map(day => ({
            date: day.dayId,
            dateLabel: day.dateLabel,
            intensity: day.completionPercentage || 0
        }));

        res.json({
            habitPerformance,
            dailyProgress,
            weeklyStats,
            heatmap: last30Days
        });

    } catch (error) {
        console.error('Get chart data error:', error);
        res.status(500).json({ error: 'Failed to get chart data' });
    }
}
