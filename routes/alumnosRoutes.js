import { Router } from 'express';
import { addAlumno, getAllAlumnos, getAlumnoById } from '../controllers/alumnosController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const router = Router();

router.post('/add', authenticateToken, addAlumno);
router.get('/', authenticateToken, getAllAlumnos);
router.get('/:alumnoId', authenticateToken, getAlumnoById);


export default router;
