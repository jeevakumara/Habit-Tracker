import React, { useState, useEffect } from 'react';
import { Day } from '../types';
import { useTrackerStore } from '../store/useTrackerStore';
import HabitCheckbox from './HabitCheckbox';
import ProgressBar from './ProgressBar';
import api from '../services/api';

interface DayModalProps {
    isOpen: boolean;
    day: Day | null;
    userId: string;
    onClose: () => void;
}

const DayModal: React.FC<DayModalProps> = ({ isOpen, day, userId, onClose }) => {
    const [notes, setNotes] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const { updateDay, showToast, setAnalytics } = useTrackerStore();

    useEffect(() => {
        if (day) {
            setNotes(day.notes || '');
        }
    }, [day]);

    if (!isOpen || !day) return null;

    const handleHabitToggle = async (habitId: string, isChecked: boolean) => {
        try {
            const response = await api.updateDayHabits(userId, day.dayId, habitId, isChecked);

            // Update local state optimistically
            const updatedCompletedHabits = isChecked
                ? [...(day.completedHabits || []), habitId]
                : (day.completedHabits || []).filter(id => id !== habitId);

            updateDay(day.dayId, {
                completedHabits: updatedCompletedHabits,
                completionPercentage: response.completionPercentage,
                isCompleted: response.isCompleted,
            });

            // Update analytics and user streaks
            setAnalytics({
                currentStreak: response.currentStreak,
                longestStreak: response.longestStreak,
                totalDaysCompleted: 0,
                overallCompletion: 0,
                daysRemaining: 0,
                totalDays: 90,
            });

            showToast(isChecked ? 'Habit completed! 🎉' : 'Habit unmarked', isChecked ? 'success' : 'info');
        } catch (error: any) {
            console.error('Failed to update habit:', error);
            showToast('Failed to update habit', 'error');
        }
    };

    const handleSaveNotes = async () => {
        try {
            setIsSaving(true);
            await api.updateDayNotes(userId, day.dayId, notes);
            updateDay(day.dayId, { notes });
            showToast('Notes saved!', 'success');
        } catch (error) {
            showToast('Failed to save notes', 'error');
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                {/* Header */}
                <div className="sticky top-0 bg-white dark:bg-neutral-800 border-b border-neutral-200 dark:border-neutral-700 p-6 rounded-t-card">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
                                Day {day.dayNumber} - {day.dateLabel}
                            </h2>
                            <p className="text-sm text-neutral-500 dark:text-neutral-400 mt-1">
                                {day.dayId}
                            </p>
                        </div>
                        <button
                            onClick={onClose}
                            className="text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-200 transition-colors text-3xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    {/* Progress Bar */}
                    <div className="mt-4">
                        <ProgressBar percentage={day.completionPercentage} />
                    </div>

                    <div className="mt-3 text-center">
                        <span className="text-sm font-semibold text-neutral-600 dark:text-neutral-400">
                            {day.completedHabits?.length || 0} of {day.totalHabits} habits completed
                        </span>
                    </div>
                </div>

                {/* Habits List */}
                <div className="p-6">
                    <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4">
                        Today's Habits
                    </h3>
                    <div className="space-y-2">
                        {day.habits && day.habits.length > 0 ? (
                            day.habits.map((habit) => (
                                <HabitCheckbox
                                    key={habit.habitId}
                                    habit={habit}
                                    isChecked={day.completedHabits?.includes(habit.habitId) || false}
                                    onToggle={handleHabitToggle}
                                />
                            ))
                        ) : (
                            <p className="text-neutral-500 text-center py-8">No habits for this day</p>
                        )}
                    </div>

                    {/* Notes Section */}
                    <div className="mt-6">
                        <label className="block text-sm font-bold text-neutral-700 dark:text-neutral-300 mb-2">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            className="input-premium min-h-24 resize-none"
                            placeholder="How did today go? Any reflections or insights..."
                        />
                        <div className="mt-2 flex justify-end">
                            <button
                                onClick={handleSaveNotes}
                                disabled={isSaving}
                                className="btn-primary"
                            >
                                {isSaving ? 'Saving...' : 'Save Notes'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DayModal;
