import React, { useEffect, useState } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import DayGrid from '../components/DayGrid';
import DayModal from '../components/DayModal';
import StreakCard from '../components/StreakCard';
import HabitPerformanceChart from '../components/analytics/HabitPerformanceChart';
import DailyProgressChart from '../components/analytics/DailyProgressChart';
import api from '../services/api';
import { Day } from '../types';

// Demo user ID for now (in production, get from auth)
const DEMO_USER_ID = 'demo-user-123';

const Dashboard: React.FC = () => {
    const {
        days,
        setDays,
        selectedDayId,
        setSelectedDayId,
        analytics,
        setAnalytics,
        chartData,
        setChartData,
        setLoading,
        showToast
    } = useTrackerStore();

    const [selectedDay, setSelectedDay] = useState<Day | null>(null);

    const loadData = React.useCallback(async () => {
        try {
            setLoading(true);

            // Load all days
            const daysData = await api.getDays(DEMO_USER_ID);
            setDays(daysData);

            // Load analytics summary
            const analyticsData = await api.getAnalyticsSummary(DEMO_USER_ID);
            setAnalytics(analyticsData);

            // Load chart data
            const charts = await api.getChartData(DEMO_USER_ID);
            setChartData(charts);

        } catch (error: any) {
            console.error('Failed to load data:', error);
            showToast('Failed to load data. Please check if backend is running.', 'error');
        } finally {
            setLoading(false);
        }
    }, [setDays, setAnalytics, setChartData, setLoading, showToast]);

    const loadDayWithHabits = React.useCallback(async (dayId: string) => {
        try {
            const dayData = await api.getDayData(DEMO_USER_ID, dayId);
            setSelectedDay(dayData);
        } catch (error) {
            console.error('Failed to load day data:', error);
            showToast('Failed to load day details', 'error');
        }
    }, [showToast]);

    useEffect(() => {
        loadData();
    }, [loadData]);

    useEffect(() => {
        if (selectedDayId) {
            const day = days.find(d => d.dayId === selectedDayId);
            if (day) {
                // Load full day data with habits
                loadDayWithHabits(selectedDayId);
            }
        } else {
            setSelectedDay(null);
        }
    }, [selectedDayId, days, loadDayWithHabits]);

    const handleDayClick = (dayId: string) => {
        setSelectedDayId(dayId);
    };

    const handleCloseModal = () => {
        setSelectedDayId(null);
        // Refresh data after closing modal
        loadData();
    };

    return (
        <div className="min-h-screen pb-12">
            {/* Header */}
            <header className="glass sticky top-0 z-30 border-b border-neutral-200 dark:border-neutral-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-3xl font-bold text-gradient">
                                90-Day Challenge Tracker
                            </h1>
                            <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                                December 1, 2025 → February 28, 2026
                            </p>
                        </div>
                        {analytics && (
                            <div className="flex items-center gap-4">
                                <div className="text-right">
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Current Streak
                                    </div>
                                    <div className="text-2xl font-bold text-warning-500">
                                        🔥 {analytics.currentStreak}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-sm text-neutral-600 dark:text-neutral-400">
                                        Overall Progress
                                    </div>
                                    <div className="text-2xl font-bold text-primary-500">
                                        {analytics.overallCompletion}%
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Streak Metrics */}
                {analytics && (
                    <StreakCard
                        currentStreak={analytics.currentStreak}
                        longestStreak={analytics.longestStreak}
                        daysRemaining={analytics.daysRemaining}
                    />
                )}

                {/* 90-Day Grid */}
                <div className="card">
                    <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100 mb-6 flex items-center gap-2">
                        <span className="text-3xl">📅</span>
                        Your 90-Day Journey
                    </h2>
                    <DayGrid days={days} onDayClick={handleDayClick} />
                </div>

                {/* Analytics Charts */}
                {chartData && (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        <HabitPerformanceChart data={chartData.habitPerformance} />
                        <DailyProgressChart data={chartData.dailyProgress} />
                    </div>
                )}
            </main>

            {/* Day Modal */}
            <DayModal
                isOpen={selectedDayId !== null}
                day={selectedDay}
                userId={DEMO_USER_ID}
                onClose={handleCloseModal}
            />
        </div>
    );
};

export default Dashboard;
