import { create } from 'zustand';
import { Habit, Day, User, AnalyticsSummary, ChartData } from '../types';

interface TrackerState {
    // User state
    user: User | null;
    setUser: (user: User | null) => void;

    // Habits state
    habits: Habit[];
    setHabits: (habits: Habit[]) => void;
    addHabit: (habit: Habit) => void;
    updateHabit: (habitId: string, updates: Partial<Habit>) => void;
    removeHabit: (habitId: string) => void;

    // Days state
    days: Day[];
    setDays: (days: Day[]) => void;
    updateDay: (dayId: string, updates: Partial<Day>) => void;

    // Selected day (for modal)
    selectedDayId: string | null;
    setSelectedDayId: (dayId: string | null) => void;

    // Analytics state
    analytics: AnalyticsSummary | null;
    setAnalytics: (analytics: AnalyticsSummary) => void;

    chartData: ChartData | null;
    setChartData: (chartData: ChartData) => void;

    // UI state
    isDarkMode: boolean;
    toggleDarkMode: () => void;

    isLoading: boolean;
    setLoading: (loading: boolean) => void;

    // Toast notifications
    toast: { message: string; type: 'success' | 'error' | 'info' } | null;
    showToast: (message: string, type?: 'success' | 'error' | 'info') => void;
    hideToast: () => void;
}

export const useTrackerStore = create<TrackerState>((set) => ({
    // User state
    user: null,
    setUser: (user) => set({ user }),

    // Habits state
    habits: [],
    setHabits: (habits) => set({ habits }),
    addHabit: (habit) => set((state) => ({ habits: [...state.habits, habit] })),
    updateHabit: (habitId, updates) => set((state) => ({
        habits: state.habits.map((h) => (h.habitId === habitId ? { ...h, ...updates } : h))
    })),
    removeHabit: (habitId) => set((state) => ({
        habits: state.habits.filter((h) => h.habitId !== habitId)
    })),

    // Days state
    days: [],
    setDays: (days) => set({ days }),
    updateDay: (dayId, updates) => set((state) => ({
        days: state.days.map((d) => (d.dayId === dayId ? { ...d, ...updates } : d))
    })),

    // Selected day
    selectedDayId: null,
    setSelectedDayId: (dayId) => set({ selectedDayId: dayId }),

    // Analytics
    analytics: null,
    setAnalytics: (analytics) => set({ analytics }),

    chartData: null,
    setChartData: (chartData) => set({ chartData }),

    // UI state
    isDarkMode: false,
    toggleDarkMode: () => set((state) => {
        const newMode = !state.isDarkMode;
        if (newMode) {
            document.documentElement.classList.add('dark');
        } else {
            document.documentElement.classList.remove('dark');
        }
        localStorage.setItem('darkMode', newMode.toString());
        return { isDarkMode: newMode };
    }),

    isLoading: false,
    setLoading: (loading) => set({ isLoading: loading }),

    // Toast
    toast: null,
    showToast: (message, type = 'success') => set({ toast: { message, type } }),
    hideToast: () => set({ toast: null }),
}));
