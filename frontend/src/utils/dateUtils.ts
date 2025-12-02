import { addDays, format, parseISO } from 'date-fns';

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
 * Format date to YYYY-MM-DD
 */
export function formatDate(date: Date): string {
    return format(date, 'yyyy-MM-dd');
}

/**
 * Get day number (1-90) for a specific date
 */
export function getDayNumber(dateString: string): number | null {
    const startDate = new Date('2025-12-01');
    const targetDate = parseISO(dateString);
    const daysDiff = Math.floor((targetDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24));

    if (daysDiff < 0 || daysDiff >= 90) {
        return null;
    }

    return daysDiff + 1;
}

/**
 * Check if date is within challenge period
 */
export function isWithinChallenge(dateString: string): boolean {
    const startDate = new Date('2025-12-01');
    const endDate = new Date('2026-02-28');
    const date = parseISO(dateString);

    return date >= startDate && date <= endDate;
}

/**
 * Get current day number based on today's date
 */
export function getCurrentDayNumber(): number | null {
    const today = formatDate(new Date());
    return getDayNumber(today);
}
