import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth.routes.js';
import habitsRoutes from './routes/habits.routes.js';
import daysRoutes from './routes/days.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3000',
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Health check
app.get('/health', (req, res) => {
    res.json({ status: 'OK', message: '90-Day Tracker API is running' });
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', habitsRoutes);
app.use('/api/users', daysRoutes);
app.use('/api/users', analyticsRoutes);

// Error handling middleware
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(err.status || 500).json({
        error: err.message || 'Internal server error'
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ error: 'Route not found' });
});

app.listen(PORT, () => {
    console.log(`🚀 90-Day Tracker API running on port ${PORT}`);
    console.log(`📅 Challenge Period: Dec 1, 2025 - Feb 28, 2026`);
});

export default app;
