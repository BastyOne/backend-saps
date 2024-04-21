const express = require('express');
const { getFAQs, getFAQsByCategory, addFAQ, updateFAQ, deleteFAQ } = require('../controllers/faqController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

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

module.exports = router;
