import { addDays, format, parseISO, differenceInDays } from 'date-fns';

/**
 * Generate all 90 dates from Dec 1, 2025 to Feb 28, 2026
 */
export function generate90Days() {
    const startDate = new Date('2025-12-01');
    const days = [];

    for (let i = 0; i < 90; i++) {
        const currentDate = addDays(startDate, i);
        days.push({
            dayId: format(currentDate, 'yyyy-MM-dd'),
            date: currentDate,
            dayNumber: i + 1,
            dateLabel: format(currentDate, 'MMM d')
        });
    }

    return days;
}

/**
 * Get day number (1-90) for a specific date
 */
export function getDayNumber(dateString) {
    const startDate = new Date('2025-12-01');
    const targetDate = parseISO(dateString);
    const daysDiff = differenceInDays(targetDate, startDate);

    if (daysDiff < 0 || daysDiff >= 90) {
        return null;
    }

    return daysDiff + 1;
}

/**
 * Format date to YYYY-MM-DD
 */
export function formatDate(date) {
    return format(date, 'yyyy-MM-dd');
}

/**
 * Check if date is within challenge period
 */
export function isWithinChallenge(dateString) {
    const startDate = new Date('2025-12-01');
    const endDate = new Date('2026-02-28');
    const date = parseISO(dateString);

    return date >= startDate && date <= endDate;
}

/**
 * Get current day number based on today's date
 */
export function getCurrentDayNumber() {
    const today = formatDate(new Date());
    return getDayNumber(today);
}
