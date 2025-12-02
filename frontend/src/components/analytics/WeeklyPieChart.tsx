import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';

interface WeeklyStatsData {
    completed: number;
    partial: number;
    notStarted: number;
}

interface WeeklyPieChartProps {
    data: WeeklyStatsData;
}

const WeeklyPieChart: React.FC<WeeklyPieChartProps> = ({ data }) => {
    const chartData = [
        { name: 'Completed (100%)', value: data.completed, color: '#10b981' },
        { name: 'In Progress', value: data.partial, color: '#eab308' },
        { name: 'Not Started', value: data.notStarted, color: '#6b7280' },
    ];

    return (
        <div className="card">
            <h3 className="text-lg font-bold text-neutral-800 dark:text-neutral-100 mb-4 flex items-center gap-2">
                <span className="text-2xl">🥧</span>
                This Week's Breakdown
            </h3>
            <ResponsiveContainer width="100%" height={300}>
                <PieChart>
                    <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name}: ${((percent || 0) * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                    >
                        {chartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                    </Pie>
                    <Tooltip
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e5e7eb',
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                        }}
                    />
                    <Legend />
                </PieChart>
            </ResponsiveContainer>
        </div>
    );
};

export default WeeklyPieChart;
