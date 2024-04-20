const express = require('express');
const router = express.Router();
const authenticateToken = require('../middleware/authMiddleware');
const { login } = require('../controllers/authController');


router.post('/login', authenticateToken, login);

module.exports = router;
