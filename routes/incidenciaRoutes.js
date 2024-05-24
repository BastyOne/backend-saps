import express from 'express';
import { createIncidencia, getIncidenciasPorPersonal, getCategoriasPadre, getCategoriasHijo, getIncidenciasPorAlumno, cerrarIncidencia, reabrirIncidencia } from '../controllers/incidenciaController.js';
import { responderIncidencia, getRespuestasPorIncidencia } from '../controllers/respuestaIncidenciaController.js';
import upload from '../middleware/uploadMiddleware.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = express.Router();

// Crear una nueva incidencia con archivo adjunto
router.post('/', authenticateToken, upload.single('archivo'), createIncidencia);
router.get('/porPersonal/:personalId', authenticateToken, getIncidenciasPorPersonal);
router.get('/categoriasPadre', authenticateToken, getCategoriasPadre);
router.get('/categoriasHijo/:padreId', authenticateToken, getCategoriasHijo);

router.post('/responder', authenticateToken, responderIncidencia);

router.get('/porAlumno/:alumnoId', authenticateToken, getIncidenciasPorAlumno);
router.get('/respuestasPorIncidencia/:incidenciaId', authenticateToken, getRespuestasPorIncidencia);

router.put('/cerrar/:incidenciaId', authenticateToken, cerrarIncidencia);
router.put('/reabrir/:incidenciaId', authenticateToken, reabrirIncidencia);

export default router;
