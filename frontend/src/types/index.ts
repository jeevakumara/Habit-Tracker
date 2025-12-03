export interface Habit {
    id: string;
    habitId?: string;
    name: string;
    icon?: string;
    order: number;
    isCompleted?: boolean;
    // Keep existing fields if needed for compatibility, or remove if unused
    category?: string;
    color?: string;
    createdAt?: any;
    isActive?: boolean;
    completionRate?: number;
    frequency?: string;
}

export interface Day {
    id: string;
    dayId: string;
    dayNumber: number;
    date: string;
    dateLabel?: string;
    habits?: Habit[];
    completedHabits?: string[];
    habitsDueForDay?: string[];
    completionPercentage: number;
    totalHabits?: number;
    completedHabitsCount?: number;
    notes?: string;
    createdAt?: string;
    updatedAt?: string;
    // Keep existing fields if needed
    isCompleted?: boolean;
    lastUpdated?: any;
}

export interface User {
    userId: string;
    email: string;
    displayName: string;
    createdAt: any;
    challengeStartDate: string;
    challengeEndDate: string;
    currentStreak: number;
    longestStreak: number;
    totalDaysCompleted: number;
}

export interface AnalyticsSummary {
    currentStreak: number;
    longestStreak: number;
    totalDaysCompleted: number;
    overallCompletion: number;
    daysRemaining: number;
    totalDays: number;
}

export interface ChartData {
    habitPerformance: Array<{
        name: string;
        completionRate: number;
        color: string;
    }>;
    dailyProgress: Array<{
        day: number;
        dateLabel: string;
        completionPercentage: number;
    }>;
    weeklyStats: {
        completed: number;
        partial: number;
        notStarted: number;
    };
    heatmap: Array<{
        date: string;
        dateLabel: string;
        intensity: number;
    }>;
}
