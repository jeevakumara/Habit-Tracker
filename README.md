# 90-Day Habit Tracker

[![Security](https://img.shields.io/badge/Security-Hardened-green)](./SECURITY.md) [![CI/CD](https://img.shields.io/badge/CI%2FCD-GitHub%20Actions-blue)](./.github/workflows/ci.yml) [![Docker](https://img.shields.io/badge/Docker-Ready-blue)](./docker-compose.yml)

> ⚠️ **CRITICAL:** Configure Firebase credentials before running. See [SECURITY.md](./SECURITY.md)

A personal 90-day self-improvement challenge tracker (Dec 1, 2025 → Feb 28, 2026) with real-time progress visualization, advanced analytics, and premium UI/UX inspired by Google and Zoho design systems.

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- Firebase account (for Firestore)

### Backend Setup

```bash
cd backend
npm install
# Make sure .env file is configured with your Firebase credentials
npm run dev
```

The backend will start on `http://localhost:5000`

### Frontend Setup

```bash
cd frontend
npm install
npm start
```

The frontend will start on `http://localhost:3000`

## 📁 Project Structure

```
90-day-tracker/
├── backend/                 # Node.js + Express API
│   ├── src/
│   │   ├── config/         # Firebase configuration
│   │   ├── controllers/    # Business logic
│   │   ├── routes/         # API endpoints
│   │   ├── middleware/     # Auth middleware
│   │   └── utils/          # Helper functions
│   ├── .env                # Environment variables
│   └── package.json
│
└── frontend/               # React + TypeScript
    ├── src/
    │   ├── components/     # Reusable UI components
    │   ├── pages/          # Main pages (Dashboard, Analytics, Settings)
    │   ├── services/       # API and Firebase services
    │   ├── store/          # Zustand state management
    │   ├── types/          # TypeScript interfaces
    │   └── utils/          # Helper functions
    ├── .env                # Environment variables
    └── package.json
```

## 🎯 Features

### Core Features
- **90-Day Grid**: Visual 9×10 grid layout with color-coded cells
- **Real-time Updates**: Instant sync across all metrics and charts
- **Daily Habit Tracking**: Modal interface for checking off daily habits
- **Streak Tracking**: Current and longest streak calculations
- **Dynamic Habits**: Add new habits mid-challenge (applies to incomplete days only)

### Analytics Dashboard
- Habit performance bar chart
- Daily progress line chart
- Weekly breakdown pie chart
- 30-day heatmap calendar
- Monthly progress summary

### Premium UI/UX
- Google/Zoho-inspired design system
- Smooth animations and micro-interactions
- Dark mode support
- Fully responsive (mobile/tablet/desktop)
- Custom gradient color palette

## 🔧 Configuration

### Backend Environment Variables (.env)
```env
PORT=5000
NODE_ENV=development
FIREBASE_PROJECT_ID=your-project-id
FIREBASE_PRIVATE_KEY=your-private-key
FIREBASE_CLIENT_EMAIL=your-client-email
CHALLENGE_START_DATE=2025-12-01
CHALLENGE_END_DATE=2026-02-28
```

### Frontend Environment Variables (.env)
```env
REACT_APP_API_URL=http://localhost:5000
REACT_APP_FIREBASE_API_KEY=your-api-key
REACT_APP_FIREBASE_AUTH_DOMAIN=your-domain
REACT_APP_FIREBASE_PROJECT_ID=your-project-id
```

## 📊 Default Habits

The system comes with 11 pre-configured habits:
1. Meditation
2. Breath Exercise
3. Book (Reading)
4. Physical Exercise
5. OOPs Project
6. Data Structures & Algorithms
7. GATE CSE Preparation
8. Moisturizer (2x daily)
9. Inhaler (3x daily)
10. 3 Liters of Water
11. Startup Work

## 🎨 Tech Stack

- **Backend**: Node.js, Express.js, Firebase Admin SDK
- **Frontend**: React, TypeScript, Tailwind CSS
- **Database**: Firebase Firestore
- **State Management**: Zustand
- **Charts**: Recharts
- **Routing**: React Router
- **Date Utilities**: date-fns

## 🚢 Deployment

### Backend
Deploy to Railway, Heroku, or Firebase Cloud Functions

### Frontend
Deploy to Vercel, Netlify, or Firebase Hosting

## 📝 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/users/:userId` - Get user profile

### Habits
- `GET /api/users/:userId/habits` - Get all habits
- `POST /api/users/:userId/habits` - Add new habit
- `PUT /api/users/:userId/habits/:habitId` - Update habit
- `DELETE /api/users/:userId/habits/:habitId` - Delete habit

### Days
- `GET /api/users/:userId/days` - Get all days
- `GET /api/users/:userId/days/:dayId` - Get specific day
- `PUT /api/users/:userId/days/:dayId` - Update day habits
- `POST /api/users/:userId/days/:dayId/notes` - Add/update notes

### Analytics
- `GET /api/users/:userId/analytics/summary` - Overall metrics
- `GET /api/users/:userId/analytics/monthly/:month` - Monthly breakdown
- `GET /api/users/:userId/analytics/habit/:habitId` - Habit-specific analytics
- `GET /api/users/:userId/analytics/charts` - All chart data

## 🎯 Challenge Period

**December 1, 2025 → February 28, 2026**
- Total Days: 90
- December: 30 days (Dec 1-31, excluding Dec 31)
- January: 31 days (Jan 1-31)
- February: 28 days (Feb 1-28)

## 🏆 Motivation

This isn't just a tracker. It's your digital accountability partner for 90 days of disciplined habit-building. Every pixel, every animation, every metric is designed to motivate you through your self-improvement journey.

**Build with PURPOSE. Track with DISCIPLINE. COMPLETE with PRIDE.** 🚀
