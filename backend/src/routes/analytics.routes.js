import express from 'express';
import { getAnalyticsSummary, getMonthlyBreakdown, getHabitAnalytics, getChartData } from '../controllers/analyticsController.js';

const router = express.Router();

router.get('/:userId/analytics/summary', getAnalyticsSummary);
router.get('/:userId/analytics/monthly/:month', getMonthlyBreakdown);
router.get('/:userId/analytics/habit/:habitId', getHabitAnalytics);
router.get('/:userId/analytics/charts', getChartData);

export default router;
