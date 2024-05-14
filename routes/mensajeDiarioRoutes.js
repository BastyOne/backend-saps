const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const mensajeDiarioController = require('../controllers/mensajeDiarioController');

router.get('/mensajes-diarios', authenticateToken, mensajeDiarioController.getMensajesConImagenes);
router.put('/mensajes-diarios/:id/activo', authenticateToken, mensajeDiarioController.toggleActivo);

module.exports = router;
