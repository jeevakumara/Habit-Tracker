import React, { useEffect } from 'react';
import { useTrackerStore } from '../store/useTrackerStore';

const Toast: React.FC = () => {
    const { toast, hideToast } = useTrackerStore();

    useEffect(() => {
        if (toast) {
            const timer = setTimeout(() => {
                hideToast();
            }, 3000);

            return () => clearTimeout(timer);
        }
    }, [toast, hideToast]);

    if (!toast) return null;

    const bgColor = {
        success: 'bg-success-500',
        error: 'bg-red-500',
        info: 'bg-primary-500'
    }[toast.type];

    return (
        <div className="fixed bottom-4 right-4 z-50 animate-slide-up">
            <div className={`${bgColor} text-white px-6 py-3 rounded-premium shadow-premium-lg flex items-center gap-3`}>
                <span className="text-lg">
                    {toast.type === 'success' && '✓'}
                    {toast.type === 'error' && '✕'}
                    {toast.type === 'info' && 'ℹ'}
                </span>
                <span className="font-medium">{toast.message}</span>
                <button
                    onClick={hideToast}
                    className="ml-4 text-white/80 hover:text-white font-bold"
                >
                    ×
                </button>
            </div>
        </div>
    );
};

export default Toast;
