import { Router } from 'express';
import authenticateToken from '../middleware/authMiddleware.js';
import { getMensajesConImagenes, toggleActivo, addMensajeDiario, removeMensajeDiario } from '../controllers/mensajeDiarioController.js';
import upload from '../middleware/uploadMiddleware.js';

const router = Router();

router.get('/mensajes-diarios', authenticateToken, getMensajesConImagenes);
router.put('/mensajes-diarios/:id/activo', authenticateToken, toggleActivo);
router.post('/mensajes-diarios', authenticateToken, upload.single('archivo'), addMensajeDiario);
router.delete('/mensajes-diarios/:id', authenticateToken, removeMensajeDiario);

export default router;
