const express = require('express');
const { addAlumno, getAllAlumnos, getAlumnoById } = require('../controllers/alumnosController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', authenticateToken, addAlumno);
router.get('/', authenticateToken, getAllAlumnos);
router.get('/:alumnoId', authenticateToken, getAlumnoById);


module.exports = router;
