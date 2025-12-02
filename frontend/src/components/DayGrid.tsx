import React from 'react';
import { Day } from '../types';
import { getCellColorClass } from '../utils/colorUtils';

interface DayGridProps {
    days: Day[];
    onDayClick: (dayId: string) => void;
}

const DayGrid: React.FC<DayGridProps> = ({ days, onDayClick }) => {
    return (
        <div className="w-full max-w-7xl mx-auto p-4">
            <div className="grid grid-cols-5 sm:grid-cols-10 gap-2 md:gap-3">
                {days.map((day) => (
                    <div
                        key={day.dayId}
                        onClick={() => onDayClick(day.dayId)}
                        className={`grid-cell ${getCellColorClass(day.completionPercentage)} group`}
                    >
                        {/* Date Label */}
                        <div className="absolute top-1 left-1 text-xs font-semibold text-white bg-black/20 px-1.5 py-0.5 rounded">
                            {day.dateLabel}
                        </div>

                        {/* Day Number */}
                        <div className="absolute top-1 right-1 text-xs font-bold text-white/80">
                            {day.dayNumber}
                        </div>

                        {/* Completion Percentage */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center">
                                <div className="text-2xl md:text-3xl font-bold text-white drop-shadow-lg">
                                    {day.completionPercentage}%
                                </div>
                                {day.completionPercentage === 100 && (
                                    <div className="text-xs text-white font-semibold mt-1">✓ DONE</div>
                                )}
                            </div>
                        </div>

                        {/* Hover Effect Overlay */}
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-200 rounded-premium" />

                        {/* Progress Bar at Bottom */}
                        <div className="absolute bottom-0 left-0 right-0 h-1 bg-black/20">
                            <div
                                className="h-full bg-white/80 transition-all duration-300"
                                style={{ width: `${day.completionPercentage}%` }}
                            />
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DayGrid;
