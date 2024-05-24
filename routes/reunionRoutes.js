import { Router } from 'express';
import { programarReunion } from '../controllers/reunionController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const router = Router();


// Define la ruta para programar reuniones
router.post('/programar', authenticateToken, programarReunion);

export default router;
