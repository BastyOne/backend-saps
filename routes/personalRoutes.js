const express = require('express');
const { addPersonal, getAllPersonal, getPersonalById } = require('../controllers/personalController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', authenticateToken, addPersonal);
router.get('/', authenticateToken, getAllPersonal);
router.get('/:personalId', authenticateToken, getPersonalById);

module.exports = router;
