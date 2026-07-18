import { Router } from 'express';
import { githubCallback, healthCheck, mockLogin } from '../controllers/authController.js';

const router = Router();

router.get('/health', healthCheck);
router.post('/github/callback', githubCallback);
router.post('/mock-login', mockLogin);

export default router;
