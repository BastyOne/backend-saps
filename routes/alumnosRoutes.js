const express = require('express');
const { addAlumno, getAllAlumnos } = require('../controllers/alumnosController');
const router = express.Router();

router.post('/add', addAlumno);
router.get('/', getAllAlumnos);

module.exports = router;
