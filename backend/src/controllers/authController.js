import { db, auth } from '../config/firebase.js';
import { generate90Days } from '../utils/dateUtils.js';

/**
 * Register new user
 */
export async function register(req, res) {
    try {
        const { email, password, displayName } = req.body;

        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password required' });
        }

        // Create user in Firebase Auth
        const userRecord = await auth.createUser({
            email,
            password,
            displayName: displayName || 'Tracker User'
        });

        // Create user document in Firestore
        await db.collection('users').doc(userRecord.uid).set({
            userId: userRecord.uid,
            email: email,
            displayName: displayName || 'Tracker User',
            createdAt: new Date(),
            challengeStartDate: '2025-12-01',
            challengeEndDate: '2026-02-28',
            currentStreak: 0,
            longestStreak: 0,
            totalDaysCompleted: 0
        });

        // Initialize default habits
        const defaultHabits = [
            { name: 'Meditation', category: 'health', color: '#10B981' },
            { name: 'Breath Exercise', category: 'health', color: '#3B82F6' },
            { name: 'Book (Reading)', category: 'learning', color: '#8B5CF6' },
            { name: 'Physical Exercise', category: 'health', color: '#EF4444' },
            { name: 'OOPs Project', category: 'productivity', color: '#F59E0B' },
            { name: 'Data Structures & Algorithms', category: 'learning', color: '#EC4899' },
            { name: 'GATE CSE Preparation', category: 'learning', color: '#6366F1' },
            { name: 'Moisturizer (2x daily)', category: 'habits', color: '#14B8A6' },
            { name: 'Inhaler (3x daily)', category: 'habits', color: '#F97316' },
            { name: '3 Liters of Water', category: 'health', color: '#06B6D4' },
            { name: 'Startup Work', category: 'productivity', color: '#A855F7' }
        ];

        const habitIds = [];
        for (const habit of defaultHabits) {
            const habitRef = await db.collection('users').doc(userRecord.uid).collection('habits').add({
                name: habit.name,
                category: habit.category,
                color: habit.color,
                createdAt: new Date(),
                isActive: true,
                completionRate: 0,
                frequency: 'daily'
            });
            habitIds.push(habitRef.id);
        }

        // Initialize all 90 days
        const days = generate90Days();
        const batch = db.batch();

        days.forEach(day => {
            const dayRef = db.collection('users').doc(userRecord.uid).collection('days').doc(day.dayId);
            batch.set(dayRef, {
                dayId: day.dayId,
                date: day.date,
                dayNumber: day.dayNumber,
                dateLabel: day.dateLabel,
                completedHabits: [],
                totalHabits: habitIds.length,
                completionPercentage: 0,
                isCompleted: false,
                notes: '',
                lastUpdated: new Date(),
                habitsDueForDay: habitIds
            });
        });

        await batch.commit();

        // Generate custom token for immediate login
        const customToken = await auth.createCustomToken(userRecord.uid);

        res.status(201).json({
            message: 'User registered successfully',
            userId: userRecord.uid,
            customToken
        });

    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: error.message || 'Registration failed' });
    }
}

/**
 * Login user (Firebase handles this on client, this is for custom token generation)
 */
export async function login(req, res) {
    try {
        const { uid } = req.body;

        if (!uid) {
            return res.status(400).json({ error: 'User ID required' });
        }

        // Verify user exists
        const userDoc = await db.collection('users').doc(uid).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate custom token
        const customToken = await auth.createCustomToken(uid);

        res.json({
            message: 'Login successful',
            customToken,
            user: userDoc.data()
        });

    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: error.message || 'Login failed' });
    }
}

/**
 * Get user profile
 */
export async function getUserProfile(req, res) {
    try {
        const { userId } = req.params;

        const userDoc = await db.collection('users').doc(userId).get();

        if (!userDoc.exists) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.json(userDoc.data());

    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Failed to get user profile' });
    }
}
