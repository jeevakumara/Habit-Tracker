import express from 'express';
import { getHabits, createHabit, updateHabit, deleteHabit } from '../controllers/habitsController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:userId/habits', getHabits);
router.post('/:userId/habits', createHabit);
router.put('/:userId/habits/:habitId', updateHabit);
router.delete('/:userId/habits/:habitId', deleteHabit);

export default router;
