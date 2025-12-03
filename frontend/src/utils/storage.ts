export const storage = {
    getItem: (key: string, fallback: string = ''): string => {
        try {
            if (typeof window === 'undefined') return fallback;
            return localStorage.getItem(key) ?? fallback;
        } catch (error) {
            console.warn(`localStorage.getItem failed:`, error);
            return fallback;
        }
    },

    setItem: (key: string, value: string): boolean => {
        try {
            if (typeof window === 'undefined') return false;
            localStorage.setItem(key, value);
            return true;
        } catch (error) {
            console.warn(`localStorage.setItem failed:`, error);
            return false;
        }
    },

    removeItem: (key: string): boolean => {
        try {
            if (typeof window === 'undefined') return false;
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.warn(`localStorage.removeItem failed:`, error);
            return false;
        }
    },
};
