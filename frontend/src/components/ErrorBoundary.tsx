import React from 'react';

interface Props {
    children: React.ReactNode;
}

interface State {
    hasError: boolean;
    error?: Error;
}

export class ErrorBoundary extends React.Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('🔴 Error caught by boundary:', error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            return (
                <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900 dark:to-neutral-900">
                    <div className="max-w-md mx-auto p-8 bg-white dark:bg-neutral-800 rounded-3xl shadow-2xl">
                        <div className="text-center">
                            <div className="w-24 h-24 mx-auto mb-6 bg-red-100 dark:bg-red-900 rounded-2xl flex items-center justify-center">
                                <span className="text-5xl">⚠️</span>
                            </div>
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">Something Went Wrong</h2>
                            <p className="text-gray-600 dark:text-gray-300 mb-8">Your habit data is safe. Refresh to continue.</p>
                            <button
                                onClick={() => window.location.reload()}
                                className="w-full bg-gradient-to-r from-primary-500 to-primary-600 text-white py-3 px-6 rounded-2xl font-semibold hover:shadow-lg transition-all"
                            >
                                🔄 Refresh App
                            </button>
                        </div>
                    </div>
                </div>
            );
        }
        return this.props.children;
    }
}
