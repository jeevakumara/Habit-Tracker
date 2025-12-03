import { Day } from '../types';

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
        console.log('🔍 Fetching habits for user:', userId);

        const response = await this.request(`/api/users/${userId}/habits`);

        console.log('✅ Habits response:', response);

        // ✅ CRITICAL FIX: Validate response format
        if (!response.success) {
            throw new Error(response.error || 'Failed to fetch habits');
        }

        if (!Array.isArray(response.habits)) {
            throw new Error('Invalid response format: habits is not an array');
        }

        console.log(`✅ Loaded ${response.habits.length} habits`);
        return response;
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
        console.log('🔍 Fetching days for user:', userId);

        const response = await this.request(`/api/users/${userId}/days`);

        console.log('✅ Days response:', response);

        // ✅ CRITICAL FIX: Validate response format
        if (!response.success) {
            throw new Error(response.error || 'Failed to fetch days');
        }

        if (!Array.isArray(response.days)) {
            throw new Error('Invalid response format: days is not an array');
        }

        console.log(`✅ Loaded ${response.days.length} days`);
        return response;
    }

    async getDayData(userId: string, dayId: string): Promise<Day> {
        const res = await this.request(`/api/users/${userId}/days/${dayId}`);
        if (!res.success || !res.day) {
            throw new Error(res.error || 'Failed to load day');
        }
        return res.day;
    }

    async updateDayHabits(userId: string, dayId: string, data: { habits: Record<string, boolean> }) {
        console.log('💾 Updating habits for day:', dayId);
        return this.request(`/api/users/${userId}/days/${dayId}`, {
            method: 'PUT',
            body: JSON.stringify(data),
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
