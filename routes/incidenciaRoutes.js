const express = require('express');
const { createIncidencia, getIncidenciasPorPersonal } = require('../controllers/incidenciaController');
const { responderIncidencia } = require('../controllers/respuestaIncidenciaController');
const upload = require('../middleware/uploadMiddleware');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// Crear una nueva incidencia con archivo adjunto
router.post('/', authenticateToken, upload.single('archivo'), createIncidencia);
router.get('/porPersonal/:personalId', authenticateToken, getIncidenciasPorPersonal);
router.post('/responder', authenticateToken, responderIncidencia);

module.exports = router;