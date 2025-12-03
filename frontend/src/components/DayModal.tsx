import React, { useState, useEffect, useCallback } from 'react';
import { Day, Habit } from '../types';
import api from '../services/api';

interface DayModalProps {
    isOpen: boolean;
    day: Day | null;
    userId: string;
    onClose: () => void;
}

const DayModal: React.FC<DayModalProps> = ({ isOpen, day, userId, onClose }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [habitStatus, setHabitStatus] = useState<Record<string, boolean>>({});
    const [notes, setNotes] = useState('');
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const loadHabitsAndStatus = useCallback(async () => {
        if (!day) return;

        setLoading(true);
        try {
            console.log('🔍 Loading habits for day:', day.dayId || day.id);

            // Fetch all habits for the user
            const habitsResponse = await api.getHabits(userId);
            const allHabits = habitsResponse.habits || [];

            console.log('✅ Loaded habits:', allHabits.length);
            setHabits(allHabits);

            // Initialize habit status from day data
            const status: Record<string, boolean> = {};

            // If day.habits is enriched with full habit objects:
            if (Array.isArray(day.habits) && day.habits.length > 0) {
                day.habits.forEach((h: any) => {
                    status[h.id || h.habitId] = Boolean(h.isCompleted);
                });
            } else if (day.completedHabits && Array.isArray(day.completedHabits)) {
                // Fallback: use completedHabits array
                const completedSet = new Set(day.completedHabits);
                allHabits.forEach((habit: Habit) => {
                    status[habit.id] = completedSet.has(habit.id);
                });
            } else {
                // Default: all uncompleted
                allHabits.forEach((habit: Habit) => {
                    status[habit.id] = false;
                });
            }

            setHabitStatus(status);
            setNotes(day.notes || '');

            console.log('✅ Habit status initialized:', status);
        } catch (error) {
            console.error('❌ Failed to load habits:', error);
        } finally {
            setLoading(false);
        }
    }, [day, userId]);

    // Load habits and initialize state when modal opens
    useEffect(() => {
        if (isOpen && day) {
            loadHabitsAndStatus();
        }
    }, [isOpen, day, loadHabitsAndStatus]);

    const handleToggleHabit = async (habitId: string) => {
        if (!day || saving) return;

        const newStatus = {
            ...habitStatus,
            [habitId]: !habitStatus[habitId]
        };

        // Optimistic update
        setHabitStatus(newStatus);

        try {
            setSaving(true);

            // Update backend
            await api.updateDayHabits(userId, day.dayId || day.id, {
                habits: newStatus
            });

            console.log('✅ Habit toggled successfully');
        } catch (error) {
            console.error('❌ Failed to toggle habit:', error);
            // Revert on error
            setHabitStatus(habitStatus);
        } finally {
            setSaving(false);
        }
    };

    const handleSaveNotes = async () => {
        if (!day) return;

        try {
            setSaving(true);
            await api.updateDayNotes(userId, day.dayId, notes);
            console.log('✅ Notes saved');
        } catch (error) {
            console.error('❌ Failed to save notes:', error);
        } finally {
            setSaving(false);
        }
    };

    // Calculate completion percentage
    const calculateCompletion = () => {
        const total = habits.length;
        if (total === 0) return 0;

        const completed = Object.values(habitStatus).filter(Boolean).length;
        return Math.round((completed / total) * 100);
    };

    const completionPercentage = calculateCompletion();
    const completedCount = Object.values(habitStatus).filter(Boolean).length;

    if (!isOpen || !day) return null;

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
        >
            <div
                className="modal-content"
                onClick={(e) => e.stopPropagation()}
            >
                {/* Modal Header */}
                <div className="modal-header">
                    <div>
                        <h2 className="modal-title">Day {day.dayNumber}</h2>
                        <p className="modal-subtitle">{day.dateLabel || day.date}</p>
                    </div>
                    <button
                        className="close-btn"
                        onClick={onClose}
                    >
                        ×
                    </button>
                </div>

                {/* Modal Body */}
                <div className="modal-body">
                    {loading ? (
                        <div className="loading-state">
                            <div className="spinner"></div>
                            <p>Loading habits...</p>
                        </div>
                    ) : (
                        <>
                            {/* Progress Section */}
                            <div className="progress-section">
                                <h3>Progress</h3>
                                <div className="progress-bar">
                                    <div
                                        className="progress-fill"
                                        style={{ width: `${completionPercentage}%` }}
                                    />
                                </div>
                                <p className="progress-text">
                                    {completedCount} of {habits.length} habits completed ({completionPercentage}%)
                                </p>
                            </div>

                            {/* Habits Section */}
                            <div className="habits-section">
                                <h3>Today's Habits</h3>

                                {habits.length === 0 ? (
                                    <div className="no-habits">
                                        <p>No habits configured.</p>
                                        <p className="text-sm">Go to Settings to add habits.</p>
                                    </div>
                                ) : (
                                    <div className="habits-list">
                                        {habits.map((habit) => (
                                            <label
                                                key={habit.id}
                                                className={`habit-item ${habitStatus[habit.id] ? 'completed' : ''}`}
                                            >
                                                <input
                                                    type="checkbox"
                                                    checked={Boolean(habitStatus[habit.id])}
                                                    onChange={() => handleToggleHabit(habit.id)}
                                                    disabled={saving}
                                                />
                                                <span className="habit-icon">{habit.icon || '✓'}</span>
                                                <span className="habit-name">{habit.name}</span>
                                                {habitStatus[habit.id] && (
                                                    <span className="checkmark">✓</span>
                                                )}
                                            </label>
                                        ))}
                                    </div>
                                )}
                            </div>

                            {/* Notes Section */}
                            <div className="notes-section">
                                <h3>Notes (Optional)</h3>
                                <textarea
                                    className="notes-input"
                                    placeholder="How did today go? Any reflections or insights..."
                                    value={notes}
                                    onChange={(e) => setNotes(e.target.value)}
                                    onBlur={handleSaveNotes}
                                    rows={4}
                                />
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default DayModal;
