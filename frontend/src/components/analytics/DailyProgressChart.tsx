import React from 'react';
import { XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Area, AreaChart } from 'recharts';

interface DailyProgressData {
    day: number;
    dateLabel: string;
    completionPercentage: number;
}

interface DailyProgressChartProps {
    data: DailyProgressData[];
}

const DailyProgressChart: React.FC<DailyProgressChartProps> = ({ data }) => {
    return (
        <div className="card">
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">📈</span>
                Daily Progress
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                    <defs>
                        <linearGradient id="colorProgress" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#0891d2" stopOpacity={0.8} />
                            <stop offset="95%" stopColor="#0891d2" stopOpacity={0.1} />
                        </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="day"
                        tick={{ fill: '#6b7280', fontSize: 12 }}
                        label={{ value: 'Day Number', position: 'insideBottom', offset: -5, fill: '#6b7280' }}
                    />
                    <YAxis
                        tick={{ fill: '#6b7280' }}
                        label={{ value: 'Completion %', angle: -90, position: 'insideLeft', fill: '#6b7280' }}
                    />
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                        formatter={(value: number, name: string, props: any) => [
                            `${value}%`,
                            `Day ${props.payload.day} (${props.payload.dateLabel})`
                        ]}
                    />
                    <Area
                        type="monotone"
                        dataKey="completionPercentage"
                        stroke="#0891d2"
                        fillOpacity={1}
                        fill="url(#colorProgress)"
                        strokeWidth={3}
                    />
                </AreaChart>
            </ResponsiveContainer>
        </div>
    );
};

export default DailyProgressChart;
