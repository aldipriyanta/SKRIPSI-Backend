const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/mobil', require('./mobilRoutes'));
router.use('/chatbot', require('./chatbotRoutes'));

module.exports = router;