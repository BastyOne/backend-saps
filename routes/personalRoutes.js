import { Router } from 'express';
import { addPersonal, getAllPersonal, getPersonalById } from '../controllers/personalController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const router = Router();

router.post('/add', authenticateToken, addPersonal);
router.get('/', authenticateToken, getAllPersonal);
router.get('/:personalId', authenticateToken, getPersonalById);

export default router;
