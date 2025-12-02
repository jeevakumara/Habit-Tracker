/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    darkMode: 'class',
    theme: {
        extend: {
            colors: {
                // Google/Zoho-inspired premium color palette
                primary: {
                    50: '#e0f2fe',
                    100: '#bae6fd',
                    200: '#7dd3fc',
                    300: '#38bdf8',
                    400: '#0ea5e9',
                    500: '#0891d2', // Main primary
                    600: '#0678b3',
                    700: '#075985',
                    800: '#0c4a6e',
                    900: '#0a3a57',
                },
                success: {
                    50: '#dcfce7',
                    100: '#bbf7d0',
                    200: '#86efac',
                    300: '#4ade80',
                    400: '#22c55e',
                    500: '#10b981', // Main success (green)
                    600: '#059669',
                    700: '#047857',
                    800: '#065f46',
                    900: '#064e3b',
                },
                warning: {
                    50: '#fefce8',
                    100: '#fef9c3',
                    200: '#fef08a',
                    300: '#fde047',
                    400: '#facc15',
                    500: '#eab308', // Main warning (yellow)
                    600: '#ca8a04',
                    700: '#a16207',
                    800: '#854d0e',
                    900: '#713f12',
                },
                neutral: {
                    50: '#f9fafb',
                    100: '#f3f4f6',
                    200: '#e5e7eb',
                    300: '#d1d5db',
                    400: '#9ca3af',
                    500: '#6b7280', // Main neutral (gray)
                    600: '#4b5563',
                    700: '#374151',
                    800: '#1f2937',
                    900: '#111827',
                },
            },
            fontFamily: {
                sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
            },
            borderRadius: {
                'premium': '8px',
                'card': '12px',
            },
            boxShadow: {
                'premium': '0 2px 8px rgba(0, 0, 0, 0.1)',
                'premium-lg': '0 4px 16px rgba(0, 0, 0, 0.12)',
                'card': '0 1px 3px rgba(0, 0, 0, 0.08)',
            },
            animation: {
                'fade-in': 'fadeIn 0.2s ease-in',
                'slide-up': 'slideUp 0.3s ease-out',
                'scale-in': 'scaleIn 0.2s ease-out',
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0' },
                    '100%': { opacity: '1' },
                },
                slideUp: {
                    '0%': { transform: 'translateY(10px)', opacity: '0' },
                    '100%': { transform: 'translateY(0)', opacity: '1' },
                },
                scaleIn: {
                    '0%': { transform: 'scale(0.95)', opacity: '0' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
            },
        },
    },
    plugins: [],
}
