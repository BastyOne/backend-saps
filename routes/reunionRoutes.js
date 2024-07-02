import { Router } from 'express';
import { programarReunion, obtenerReuniones } from '../controllers/reunionController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const router = Router();


// Define la ruta para programar reuniones
router.post('/programar', authenticateToken, programarReunion);
router.get('/personal/:personal_id/reuniones', authenticateToken, obtenerReuniones);

export default router;
