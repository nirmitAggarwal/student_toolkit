import express from 'express';
import { getUserProfile, updateUserProfile } from '../controllers/userController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/profile', authMiddleware, getUserProfile);
router.post('/profile', authMiddleware, updateUserProfile);

export default router;
