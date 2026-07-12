const express = require('express');
const router = express.Router();

router.use('/auth', require('./authRoutes'));
router.use('/mobil', require('./mobilRoutes'));

module.exports = router;