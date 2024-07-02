import { Router } from 'express';
const router = Router();
import authenticateToken from '../middleware/authMiddleware.js';
import { login, forgotPassword, resetPassword, updatePassword } from '../controllers/authController.js';


router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.post('/update-password', updatePassword);

export default router;
