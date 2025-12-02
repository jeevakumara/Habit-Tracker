import React from 'react';

interface ProgressBarProps {
    percentage: number;
    showLabel?: boolean;
    height?: 'sm' | 'md' | 'lg';
}

const ProgressBar: React.FC<ProgressBarProps> = ({ percentage, showLabel = true, height = 'md' }) => {
    const heightClass = {
        sm: 'h-1',
        md: 'h-2',
        lg: 'h-3'
    }[height];

    const getGradientColor = () => {
        if (percentage === 0) return 'from-neutral-400 to-neutral-500';
        if (percentage < 100) return 'from-warning-400 to-warning-500';
        return 'from-success-400 to-success-500';
    };

    return (
        <div className="w-full">
            {showLabel && (
                <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
                        Progress
                    </span>
                    <span className="text-sm font-bold text-primary-600 dark:text-primary-400">
                        {percentage}%
                    </span>
                </div>
            )}
            <div className={`progress-bar ${heightClass}`}>
                <div
                    className={`progress-fill bg-gradient-to-r ${getGradientColor()}`}
                    style={{ width: `${percentage}%` }}
                >
                    {percentage === 100 && (
                        <span className="text-white text-xs font-bold px-2">✓</span>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProgressBar;
