import React, { useEffect } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import HabitPerformanceChart from '../components/analytics/HabitPerformanceChart';
import DailyProgressChart from '../components/analytics/DailyProgressChart';
import WeeklyPieChart from '../components/analytics/WeeklyPieChart';
import HeatmapCalendar from '../components/analytics/HeatmapCalendar';
import api from '../services/api';

const DEMO_USER_ID = 'lWKwaToLPHNhf6tsdiTot1yzxHW2';

const Analytics: React.FC = () => {
    const { chartData, setChartData, analytics, setAnalytics, setLoading } = useTrackerStore();

    const loadAnalytics = React.useCallback(async () => {
        try {
            setLoading(true);
            const charts = await api.getChartData(DEMO_USER_ID);
            setChartData(charts);

            const analyticsData = await api.getAnalyticsSummary(DEMO_USER_ID);
            setAnalytics(analyticsData);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    }, [setChartData, setAnalytics, setLoading]);

    useEffect(() => {
        loadAnalytics();
    }, [loadAnalytics]);

    return (
        <div className="min-h-screen pb-12">
            {/* Header */}
            <header className="glass sticky top-0 z-30 border-b border-neutral-200 dark:border-neutral-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gradient">
                        📊 Analytics Dashboard
                    </h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Detailed insights into your 90-day journey
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-7xl mx-auto px-4 py-8 space-y-8">
                {/* Summary Cards */}
                {analytics && (
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div className="card text-center">
                            <div className="text-4xl mb-2">🔥</div>
                            <div className="text-3xl font-bold text-warning-500">{analytics.currentStreak}</div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">Current Streak</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-4xl mb-2">🏆</div>
                            <div className="text-3xl font-bold text-primary-500">{analytics.longestStreak}</div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">Longest Streak</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-4xl mb-2">✅</div>
                            <div className="text-3xl font-bold text-success-500">{analytics.totalDaysCompleted}</div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">Days Completed</div>
                        </div>
                        <div className="card text-center">
                            <div className="text-4xl mb-2">📈</div>
                            <div className="text-3xl font-bold text-primary-500">{analytics.overallCompletion}%</div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400">Overall Progress</div>
                        </div>
                    </div>
                )}

                {/* Charts Grid */}
                {chartData && (
                    <>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <HabitPerformanceChart data={chartData.habitPerformance} />
                            <DailyProgressChart data={chartData.dailyProgress} />
                        </div>

                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            <WeeklyPieChart data={chartData.weeklyStats} />
                            <HeatmapCalendar data={chartData.heatmap} />
                        </div>
                    </>
                )}

                {/* Monthly Breakdown */}
                <div className="card">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
                        <span className="text-2xl">📆</span>
                        Monthly Progress
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-premium">
                            <div className="text-lg font-bold text-blue-700 dark:text-blue-400">December 2025</div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                                <div>30 days total</div>
                                <div className="mt-1 font-semibold">Progress: Tracking...</div>
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-premium">
                            <div className="text-lg font-bold text-purple-700 dark:text-purple-400">January 2026</div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                                <div>31 days total</div>
                                <div className="mt-1 font-semibold">Progress: Upcoming</div>
                            </div>
                        </div>
                        <div className="p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-900/20 dark:to-pink-800/20 rounded-premium">
                            <div className="text-lg font-bold text-pink-700 dark:text-pink-400">February 2026</div>
                            <div className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
                                <div>28 days total</div>
                                <div className="mt-1 font-semibold">Progress: Upcoming</div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Analytics;
