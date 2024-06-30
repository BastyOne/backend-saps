import { Router } from 'express';
import { addAlumno, getAllAlumnos, getAlumnoById, updateAlumno } from '../controllers/alumnosController.js';
import upload from '../middleware/uploadMiddleware.js';
import authenticateToken from '../middleware/authMiddleware.js';

const router = Router();

router.post('/add', authenticateToken, upload.single('archivo'), addAlumno);
router.get('/', authenticateToken, getAllAlumnos);
router.get('/:alumnoId', authenticateToken, getAlumnoById);
router.put('/:alumnoId', authenticateToken, updateAlumno);


export default router;
