import React from 'react';

interface StreakCardProps {
    currentStreak: number;
    longestStreak: number;
    daysRemaining: number;
}

const StreakCard: React.FC<StreakCardProps> = ({ currentStreak, longestStreak, daysRemaining }) => {
    return (
        <div className="card">
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                Streak Metrics
            </h3>

            <div className="grid grid-cols-3 gap-4">
                {/* Current Streak */}
                <div className="text-center p-4 bg-gradient-to-br from-warning-50 to-warning-100 dark:from-warning-900/20 dark:to-warning-800/20 rounded-premium">
                    <div className="text-3xl font-bold text-warning-600 dark:text-warning-400">
                        {currentStreak}
                    </div>
                    <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-1">
                        Current Streak
                    </div>
                    {currentStreak > 0 && (
                        <div className="mt-2">
                            <span className="streak-badge text-xs">
                                🔥 {currentStreak} {currentStreak === 1 ? 'day' : 'days'}
                            </span>
                        </div>
                    )}
                </div>

                {/* Longest Streak */}
                <div className="text-center p-4 bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-premium">
                    <div className="text-3xl font-bold text-primary-600 dark:text-primary-400">
                        {longestStreak}
                    </div>
                    <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-1">
                        Longest Streak
                    </div>
                    {longestStreak > 0 && (
                        <div className="mt-2">
                            <span className="inline-flex items-center px-2 py-1 rounded-full bg-primary-500 text-white text-xs font-semibold">
                                🏆 Best
                            </span>
                        </div>
                    )}
                </div>

                {/* Days Remaining */}
                <div className="text-center p-4 bg-gradient-to-br from-success-50 to-success-100 dark:from-success-900/20 dark:to-success-800/20 rounded-premium">
                    <div className="text-3xl font-bold text-success-600 dark:text-success-400">
                        {daysRemaining}
                    </div>
                    <div className="text-xs font-medium text-neutral-600 dark:text-neutral-400 mt-1">
                        Days Remaining
                    </div>
                    <div className="mt-2">
                        <span className="inline-flex items-center px-2 py-1 rounded-full bg-success-500 text-white text-xs font-semibold">
                            📅 To Go
                        </span>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StreakCard;
