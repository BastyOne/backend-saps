const express = require('express');
const { addAlumno, getAllAlumnos } = require('../controllers/alumnosController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', authenticateToken, addAlumno);
router.get('/', authenticateToken, getAllAlumnos);

module.exports = router;
