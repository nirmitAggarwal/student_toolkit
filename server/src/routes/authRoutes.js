import { Router } from 'express';
import { githubCallback, healthCheck } from '../controllers/authController.js';

const router = Router();

router.get('/health', healthCheck);
router.post('/github/callback', githubCallback);

export default router;
