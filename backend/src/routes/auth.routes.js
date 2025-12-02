import express from 'express';
import { register, login, getUserProfile } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/users/:userId', getUserProfile);

export default router;
