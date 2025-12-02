import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface HabitPerformanceData {
    name: string;
    completionRate: number;
    color: string;
}

interface HabitPerformanceChartProps {
    data: HabitPerformanceData[];
}

const HabitPerformanceChart: React.FC<HabitPerformanceChartProps> = ({ data }) => {
    return (
        <div className="card">
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">📊</span>
                Habit Performance
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 60 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis
                        dataKey="name"
                        angle={-45}
                        textAnchor="end"
                        height={100}
                        tick={{ fill: '#6b7280', fontSize: 12 }}
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
                        formatter={(value: number) => [`${value}%`, 'Completion Rate']}
                    />
                    <Bar dataKey="completionRate" radius={[8, 8, 0, 0]}>
                        {data.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};

export default HabitPerformanceChart;
