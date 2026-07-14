const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const upload = require('../middleware/upload');
const { getAll, getById, create, update, remove } = require('../controllers/mobilController');
const { uploadGambar, getGambarByMobil, removeGambar } = require('../controllers/gambarMobilController');

router.get('/', getAll);
router.get('/:id', getById);
router.post('/', authMiddleware, create);
router.put('/:id', authMiddleware, update);
router.delete('/:id', authMiddleware, remove);

router.get('/:id/gambar', getGambarByMobil);
router.post('/:id/gambar', authMiddleware, upload.single('gambar'), uploadGambar);
router.delete('/gambar/:id_gambar', authMiddleware, removeGambar);

module.exports = router;