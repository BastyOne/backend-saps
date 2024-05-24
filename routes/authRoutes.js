import { Router } from 'express';
const router = Router();
import authenticateToken from '../middleware/authMiddleware.js';
import { login } from '../controllers/authController.js';


router.post('/login', login);

export default router;
