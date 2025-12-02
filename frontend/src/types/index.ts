export interface Habit {
    habitId: string;
    name: string;
    category: string;
    color: string;
    createdAt: any;
    isActive: boolean;
    completionRate: number;
    frequency: string;
    isCompleted?: boolean;
}

export interface Day {
    dayId: string;
    date: any;
    dayNumber: number;
    dateLabel: string;
    completedHabits: string[];
    totalHabits: number;
    completionPercentage: number;
    isCompleted: boolean;
    notes: string;
    lastUpdated: any;
    habitsDueForDay: string[];
    habits?: Habit[];
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
