import React from 'react';
import { getHeatmapColor } from '../../utils/colorUtils';

interface HeatmapData {
    date: string;
    dateLabel: string;
    intensity: number;
}

interface HeatmapCalendarProps {
    data: HeatmapData[];
}

const HeatmapCalendar: React.FC<HeatmapCalendarProps> = ({ data }) => {
    return (
        <div className="card">
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">🗓️</span>
                30-Day Activity Heatmap
            </h3>

            <div className="grid grid-cols-7 gap-2">
                {data.map((day, index) => (
                    <div
                        key={day.date}
                        className="aspect-square rounded-premium cursor-pointer hover:scale-110 transition-transform duration-200 flex flex-col items-center justify-center"
                        style={{ backgroundColor: getHeatmapColor(day.intensity) }}
                        title={`${day.dateLabel}: ${day.intensity}% complete`}
                    >
                        <div className="text-xs font-semibold text-neutral-700">
                            {day.dateLabel.split(' ')[1]}
                        </div>
                        <div className="text-2xs font-bold text-neutral-600">
                            {day.intensity}%
                        </div>
                    </div>
                ))}
            </div>

            <div className="mt-4 flex items-center justify-center gap-2 text-xs text-neutral-600 dark:text-neutral-400">
                <span>Less</span>
                <div className="flex gap-1">
                    {[0, 25, 50, 75, 100].map((intensity) => (
                        <div
                            key={intensity}
                            className="w-4 h-4 rounded-sm"
                            style={{ backgroundColor: getHeatmapColor(intensity) }}
                        />
                    ))}
                </div>
                <span>More</span>
            </div>
        </div>
    );
};

export default HeatmapCalendar;
