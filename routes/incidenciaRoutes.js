const express = require('express');
const { createIncidencia, getIncidenciasPorPersonal, getCategoriasPadre, getCategoriasHijo, getIncidenciasPorAlumno, cerrarIncidencia, reabrirIncidencia } = require('../controllers/incidenciaController');
const { responderIncidencia, getRespuestasPorIncidencia } = require('../controllers/respuestaIncidenciaController');
const upload = require('../middleware/uploadMiddleware');
const authenticateToken = require('../middleware/authMiddleware');

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

module.exports = router;