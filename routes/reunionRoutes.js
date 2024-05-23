const express = require('express');
const router = express.Router();
const { programarReunion } = require('../controllers/reunionController');
const authenticateToken = require('../middleware/authMiddleware');

// Define la ruta para programar reuniones
router.post('/programar', authenticateToken, programarReunion);

module.exports = router;
