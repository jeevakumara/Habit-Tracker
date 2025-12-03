# 🚀 API Documentation

**Base URL:** `http://localhost:5000`

## Health Check

### GET /health
Returns API status

## Authentication

### POST /api/auth/register
Register user

### POST /api/auth/login
Login user

## Habits

### GET /api/users/:userId/habits
Get all habits

### POST /api/users/:userId/habits
Create habit

### PUT /api/users/:userId/habits/:habitId
Update habit

### DELETE /api/users/:userId/habits/:habitId
Delete habit

## Days

### GET /api/users/:userId/days
Get all days

### PUT /api/users/:userId/days/:dayId
Update day

## Analytics

### GET /api/users/:userId/analytics/summary
Overall stats

### GET /api/users/:userId/analytics/charts
Chart data
