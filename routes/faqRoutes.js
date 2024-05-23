import { Router } from 'express';
import { getFAQs, getFAQsByCategory, addFAQ, updateFAQ, deleteFAQ } from '../controllers/faqController.js';
import authenticateToken from '../middleware/authMiddleware.js';
const router = Router();

// Obtener todas las FAQs
router.get('/', authenticateToken, getFAQs);

// Obtener FAQs por categoría
router.get('/categoria/:categoria', authenticateToken, getFAQsByCategory);

// Añadir una nueva FAQ
router.post('/', authenticateToken, addFAQ);

// Actualizar una FAQ existente
router.put('/:id', authenticateToken, updateFAQ);

// Eliminar una FAQ
router.delete('/:id', authenticateToken, deleteFAQ);

export default router;
