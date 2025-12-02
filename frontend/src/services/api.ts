const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000';

class ApiService {
    private baseUrl: string;

    constructor() {
        this.baseUrl = API_URL;
    }

    private async request(endpoint: string, options: RequestInit = {}) {
        const url = `${this.baseUrl}${endpoint}`;

        const config: RequestInit = {
            ...options,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
        };

        try {
            const response = await fetch(url, config);
            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Request failed');
            }

            return data;
        } catch (error: any) {
            console.error('API Error:', error);
            throw error;
        }
    }

    // Auth endpoints
    async register(email: string, password: string, displayName?: string) {
        return this.request('/api/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, displayName }),
        });
    }

    async login(uid: string) {
        return this.request('/api/auth/login', {
            method: 'POST',
            body: JSON.stringify({ uid }),
        });
    }

    async getUserProfile(userId: string) {
        return this.request(`/api/auth/users/${userId}`);
    }

    // Habits endpoints
    async getHabits(userId: string) {
        return this.request(`/api/users/${userId}/habits`);
    }

    async addHabit(userId: string, habit: { name: string; category?: string; color?: string }) {
        return this.request(`/api/users/${userId}/habits`, {
            method: 'POST',
            body: JSON.stringify(habit),
        });
    }

    async updateHabit(userId: string, habitId: string, updates: any) {
        return this.request(`/api/users/${userId}/habits/${habitId}`, {
            method: 'PUT',
            body: JSON.stringify(updates),
        });
    }

    async deleteHabit(userId: string, habitId: string) {
        return this.request(`/api/users/${userId}/habits/${habitId}`, {
            method: 'DELETE',
        });
    }

    // Days endpoints
    async getDays(userId: string) {
        return this.request(`/api/users/${userId}/days`);
    }

    async getDayData(userId: string, dayId: string) {
        return this.request(`/api/users/${userId}/days/${dayId}`);
    }

    async updateDayHabits(userId: string, dayId: string, habitId: string, isCompleted: boolean) {
        return this.request(`/api/users/${userId}/days/${dayId}`, {
            method: 'PUT',
            body: JSON.stringify({ habitId, isCompleted }),
        });
    }

    async updateDayNotes(userId: string, dayId: string, notes: string) {
        return this.request(`/api/users/${userId}/days/${dayId}/notes`, {
            method: 'POST',
            body: JSON.stringify({ notes }),
        });
    }

    // Analytics endpoints
    async getAnalyticsSummary(userId: string) {
        return this.request(`/api/users/${userId}/analytics/summary`);
    }

    async getMonthlyBreakdown(userId: string, month: string) {
        return this.request(`/api/users/${userId}/analytics/monthly/${month}`);
    }

    async getHabitAnalytics(userId: string, habitId: string) {
        return this.request(`/api/users/${userId}/analytics/habit/${habitId}`);
    }

    async getChartData(userId: string) {
        return this.request(`/api/users/${userId}/analytics/charts`);
    }
}

const apiService = new ApiService();
export default apiService;
