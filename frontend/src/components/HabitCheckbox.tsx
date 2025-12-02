import React, { useState } from 'react';
import { Habit } from '../types';

interface HabitCheckboxProps {
    habit: Habit;
    isChecked: boolean;
    onToggle: (habitId: string, isChecked: boolean) => void;
}

const HabitCheckbox: React.FC<HabitCheckboxProps> = ({ habit, isChecked, onToggle }) => {
    const [isAnimating, setIsAnimating] = useState(false);

    const handleToggle = () => {
        setIsAnimating(true);
        onToggle(habit.habitId, !isChecked);
        setTimeout(() => setIsAnimating(false), 300);
    };

    return (
        <div
            className={`flex items-center gap-3 p-3 rounded-premium bg-neutral-50 dark:bg-neutral-700/50 
                  hover:bg-neutral-100 dark:hover:bg-neutral-700 transition-all duration-150 
                  ${isAnimating ? 'scale-95' : 'scale-100'}`}
        >
            <input
                type="checkbox"
                id={habit.habitId}
                checked={isChecked}
                onChange={handleToggle}
                className="checkbox-premium"
                style={{ accentColor: habit.color }}
            />
            <label
                htmlFor={habit.habitId}
                className={`flex-1 cursor-pointer font-medium transition-all duration-200 
                    ${isChecked ? 'line-through text-neutral-400' : 'text-neutral-700 dark:text-neutral-200'}`}
            >
                <span className="flex items-center gap-2">
                    <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: habit.color }}
                    />
                    {habit.name}
                </span>
            </label>
            {isChecked && (
                <span className="text-success-500 text-xl animate-scale-in">✓</span>
            )}
        </div>
    );
};

export default HabitCheckbox;
