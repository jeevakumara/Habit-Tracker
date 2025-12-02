import express from 'express';
import { getAllHabits, addHabit, updateHabit, deleteHabit } from '../controllers/habitsController.js';
import { verifyToken } from '../middleware/auth.middleware.js';

const router = express.Router();

router.get('/:userId/habits', getAllHabits);
router.post('/:userId/habits', addHabit);
router.put('/:userId/habits/:habitId', updateHabit);
router.delete('/:userId/habits/:habitId', deleteHabit);

export default router;
