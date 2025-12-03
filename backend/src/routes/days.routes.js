import express from 'express';
import { getDayById, getAllDays, updateDayHabits, updateDayNotes } from '../controllers/daysController.js';

const router = express.Router();

router.get('/:userId/days', getAllDays);
router.get('/:userId/days/:dayId', getDayById);
router.put('/:userId/days/:dayId', updateDayHabits);
router.post('/:userId/days/:dayId', updateDayHabits);
router.post('/:userId/days/:dayId/notes', updateDayNotes);

export default router;
