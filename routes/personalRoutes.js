const express = require('express');
const { addPersonal, getAllPersonal } = require('../controllers/personalController');
const router = express.Router();

router.post('/add', addPersonal);
router.get('/', getAllPersonal);

module.exports = router;
