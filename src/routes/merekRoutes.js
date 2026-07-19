const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const { getAll, create } = require('../controllers/merekController');

router.get('/', getAll);
router.post('/', authMiddleware, create);

module.exports = router;