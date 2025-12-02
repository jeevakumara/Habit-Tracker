# 🚀 Quick Setup Guide

## Prerequisites
- Node.js v16+ installed
- Firebase account (already configured with your credentials)

## Installation (First Time Only)

### Step 1: Install Backend Dependencies
```bash
cd d:\90-day-tracker\backend
npm install
```

### Step 2: Install Frontend Dependencies
```bash
cd d:\90-day-tracker\frontend
npm install
```

## Running the Application

### Option A: Using Start Script (Recommended for Windows)
Double-click `start.bat` in the root directory. This will open two command windows:
- Backend server (port 5000)
- Frontend app (port 3000)

### Option B: Manual Start

**Terminal 1 - Backend:**
```bash
cd d:\90-day-tracker\backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
cd d:\90-day-tracker\frontend
npm start
```

The frontend will automatically open at `http://localhost:3000`

## First Time Setup

### 1. Create a Test User
Use the backend API to register:

```bash
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\":\"your@email.com\",\"password\":\"yourpassword\",\"displayName\":\"Your Name\"}"
```

This will return a response with `userId` - save this!

### 2. Update Frontend with Your User ID

Edit `frontend/src/pages/Dashboard.tsx`, lines 13:
```typescript
const DEMO_USER_ID = 'your-actual-user-id-from-step-1';
```

Also update in `Analytics.tsx` and `Settings.tsx`

### 3. Start Tracking!
- Open `http://localhost:3000`
- Click any grid cell to open the day modal
- Check off habits as you complete them
- Watch your progress update in real-time!

## 🎯 Quick Testing Checklist

After setup, verify everything works:

- [ ] Backend shows "🚀 90-Day Tracker API running on port 5000"
- [ ] Frontend loads at http://localhost:3000
- [ ] Dashboard shows 90-day grid (all gray initially)
- [ ] Click a cell - modal opens with 11 default habits
- [ ] Check a habit - progress bar updates
- [ ] Check all habits - cell turns green
- [ ] Close modal - grid cell shows 100%
- [ ] Navigate to Analytics page
- [ ] Navigate to Settings page
- [ ] Toggle dark mode (moon/sun icon)
- [ ] Add a new habit in Settings
- [ ] New habit appears in grid cells

## 🔥 You're All Set!

Your 90-day journey begins Dec 1, 2025. Start building those habits!

**Need help?** Check the full README.md for detailed documentation.
