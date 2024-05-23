import { Router } from 'express';
const router = Router();
import authenticateToken from '../middleware/authMiddleware.js';
import { getMensajesConImagenes, toggleActivo } from '../controllers/mensajeDiarioController.js';

router.get('/mensajes-diarios', authenticateToken, getMensajesConImagenes);
router.put('/mensajes-diarios/:id/activo', authenticateToken, toggleActivo);

export default router;
