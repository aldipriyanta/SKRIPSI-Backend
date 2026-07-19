const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/mobil', require('./mobilRoutes'));
router.use('/chatbot', require('./chatbotRoutes'));
router.use('/merek', require('./merekRoutes'));
router.use('/kategori', require('./kategoriRoutes'));

module.exports = router;