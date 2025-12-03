import React, { useState, useEffect } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';
import api from '../services/api';

const DEMO_USER_ID = 'lWKwaToLPHNhf6tsdiTot1yzxHW2';

const Settings: React.FC = () => {
    const { habits, setHabits, isDarkMode, toggleDarkMode, showToast } = useTrackerStore();
    const [newHabitName, setNewHabitName] = useState('');
    const [newHabitCategory, setNewHabitCategory] = useState('habits');
    const [newHabitColor, setNewHabitColor] = useState('#6b7280');

    const loadHabits = React.useCallback(async () => {
        try {
            console.log('🔍 Loading habits for user:', DEMO_USER_ID);
            const habitsResponse = await api.getHabits(DEMO_USER_ID);
            setHabits(habitsResponse.habits);
            console.log('✅ Habits loaded:', habitsResponse.habits.length);
        } catch (error) {
            console.error('❌ Failed to load habits:', error);
        }
    }, [setHabits]);

    useEffect(() => {
        loadHabits();
    }, [loadHabits]);

    const handleAddHabit = async () => {
        if (!newHabitName.trim()) {
            showToast('Please enter a habit name', 'error');
            return;
        }

        try {
            await api.addHabit(DEMO_USER_ID, {
                name: newHabitName,
                category: newHabitCategory,
                color: newHabitColor,
            });

            showToast('Habit added successfully! 🎉', 'success');
            setNewHabitName('');
            setNewHabitCategory('habits');
            setNewHabitColor('#6b7280');
            loadHabits();
        } catch (error) {
            showToast('Failed to add habit', 'error');
        }
    };

    const handleDeleteHabit = async (habitId: string) => {
        if (!window.confirm('Are you sure you want to delete this habit?')) {
            return;
        }

        try {
            await api.deleteHabit(DEMO_USER_ID, habitId);
            showToast('Habit deleted', 'info');
            loadHabits();
        } catch (error) {
            showToast('Failed to delete habit', 'error');
        }
    };

    return (
        <div className="min-h-screen pb-12">
            {/* Header */}
            <header className="glass sticky top-0 z-30 border-b border-neutral-200 dark:border-neutral-700">
                <div className="max-w-7xl mx-auto px-4 py-6">
                    <h1 className="text-3xl font-bold text-gradient">
                        ⚙️ Settings
                    </h1>
                    <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-1">
                        Manage your habits and preferences
                    </p>
                </div>
            </header>

            {/* Main Content */}
            <main className="max-w-4xl mx-auto px-4 py-8 space-y-8">
                {/* Theme Toggle */}
                <div className="card">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                        Appearance
                    </h3>
                    <div className="flex items-center justify-between">
                        <div>
                            <div className="font-medium text-neutral-700 dark:text-neutral-300">Dark Mode</div>
                            <div className="text-sm text-neutral-500 dark:text-neutral-400">
                                Toggle dark/light theme
                            </div>
                        </div>
                        <button
                            onClick={toggleDarkMode}
                            className={`relative w-14 h-7 rounded-full transition-colors ${isDarkMode ? 'bg-primary-500' : 'bg-neutral-300'
                                }`}
                        >
                            <div
                                className={`absolute top-1 left-1 w-5 h-5 bg-white rounded-full transition-transform ${isDarkMode ? 'transform translate-x-7' : ''
                                    }`}
                            />
                        </button>
                    </div>
                </div>

                {/* Add New Habit */}
                <div className="card">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                        Add New Habit
                    </h3>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                Habit Name
                            </label>
                            <input
                                type="text"
                                value={newHabitName}
                                onChange={(e) => setNewHabitName(e.target.value)}
                                className="input-premium"
                                placeholder="e.g., Morning Meditation"
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Category
                                </label>
                                <select
                                    value={newHabitCategory}
                                    onChange={(e) => setNewHabitCategory(e.target.value)}
                                    className="input-premium"
                                >
                                    <option value="health">Health</option>
                                    <option value="productivity">Productivity</option>
                                    <option value="learning">Learning</option>
                                    <option value="habits">Habits</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-1">
                                    Color
                                </label>
                                <input
                                    type="color"
                                    value={newHabitColor}
                                    onChange={(e) => setNewHabitColor(e.target.value)}
                                    className="input-premium h-10"
                                />
                            </div>
                        </div>

                        <button onClick={handleAddHabit} className="btn-primary w-full">
                            Add Habit
                        </button>
                    </div>
                </div>

                {/* Current Habits */}
                <div className="card">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                        Your Habits ({habits.length})
                    </h3>
                    <div className="space-y-2">
                        {habits.map((habit) => (
                            <div
                                key={habit.habitId || habit.id}
                                className="flex items-center justify-between p-4 bg-neutral-50 dark:bg-neutral-700/50 rounded-premium hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-colors"
                            >
                                <div className="flex items-center gap-3">
                                    <div
                                        className="w-4 h-4 rounded-full"
                                        style={{ backgroundColor: habit.color }}
                                    />
                                    <div>
                                        <div className="font-medium text-neutral-700 dark:text-neutral-200">
                                            {habit.name}
                                        </div>
                                        <div className="text-xs text-neutral-500 dark:text-neutral-400">
                                            {habit.category} • {habit.completionRate}% completion rate
                                        </div>
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteHabit(habit.habitId || habit.id)}
                                    className="text-red-500 hover:text-red-700 font-medium text-sm"
                                >
                                    Delete
                                </button>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Info Section */}
                <div className="card bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20">
                    <h3 className="text-lg font-bold text-primary-700 dark:text-primary-400 mb-2">
                        💡 Pro Tip
                    </h3>
                    <p className="text-sm text-neutral-700 dark:text-neutral-300">
                        New habits will only appear on days that haven't been fully completed yet.
                        This keeps your completed days locked and preserves your progress!
                    </p>
                </div>
            </main>
        </div>
    );
};

export default Settings;
