const express = require('express');
const { addPersonal, getAllPersonal } = require('../controllers/personalController');
const authenticateToken = require('../middleware/authMiddleware');
const router = express.Router();

router.post('/add', authenticateToken, addPersonal);
router.get('/', authenticateToken, getAllPersonal);

module.exports = router;
