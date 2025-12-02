/**
 * Calculate current and longest streak from days data
 */
export function calculateStreaks(days) {
    if (!days || days.length === 0) {
        return { currentStreak: 0, longestStreak: 0 };
    }

    // Sort days by day number
    const sortedDays = [...days].sort((a, b) => a.dayNumber - b.dayNumber);

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;

    // Find the current day number
    const today = new Date();
    const startDate = new Date('2025-12-01');
    const daysDiff = Math.floor((today - startDate) / (1000 * 60 * 60 * 24));
    const currentDayNumber = daysDiff >= 0 && daysDiff < 90 ? daysDiff + 1 : 0;

    // Calculate streaks
    for (let i = 0; i < sortedDays.length; i++) {
        const day = sortedDays[i];

        // A day is complete if completion percentage is 100%
        if (day.isCompleted && day.completionPercentage === 100) {
            tempStreak++;

            // Update longest streak
            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
            }

            // Check if this is part of current streak (consecutive days up to today)
            if (i === sortedDays.length - 1 || sortedDays[i + 1].dayNumber !== day.dayNumber + 1) {
                // Streak ends here, check if it extends to current day
                if (day.dayNumber >= currentDayNumber - tempStreak) {
                    currentStreak = tempStreak;
                }
                tempStreak = 0;
            }
        } else {
            // Streak broken
            tempStreak = 0;
        }
    }

    // Calculate current streak by going backwards from today
    currentStreak = 0;
    for (let i = sortedDays.length - 1; i >= 0; i--) {
        const day = sortedDays[i];
        if (day.dayNumber > currentDayNumber) continue;

        if (day.isCompleted && day.completionPercentage === 100) {
            currentStreak++;
        } else {
            break;
        }
    }

    return { currentStreak, longestStreak };
}

/**
 * Recalculate streaks after updating a day
 */
export function recalculateStreaks(allDays, updatedDayId) {
    return calculateStreaks(allDays);
}
