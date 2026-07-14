const { Mobil, GambarMobil } = require('../models');

async function uploadGambar(req, res) {
  const mobil = await Mobil.findByPk(req.params.id);
  if (!mobil) return res.status(404).json({ message: 'Data mobil tidak ditemukan' });

  if (!req.file) {
    return res.status(400).json({ message: 'File gambar wajib diunggah' });
  }

  const gambar = await GambarMobil.create({
    id_mobil: mobil.id_mobil,
    url_gambar: `/uploads/mobil/${req.file.filename}`,
    keterangan: req.body.keterangan || null,
  });

  return res.status(201).json({ message: 'Gambar berhasil diunggah', data: gambar });
}

async function getGambarByMobil(req, res) {
  const mobil = await Mobil.findByPk(req.params.id);
  if (!mobil) return res.status(404).json({ message: 'Data mobil tidak ditemukan' });

  const gambar = await GambarMobil.findAll({ where: { id_mobil: mobil.id_mobil } });
  return res.status(200).json({ data: gambar });
}

async function removeGambar(req, res) {
  const gambar = await GambarMobil.findByPk(req.params.id_gambar);
  if (!gambar) return res.status(404).json({ message: 'Gambar tidak ditemukan' });

  await gambar.destroy();
  return res.status(200).json({ message: 'Gambar berhasil dihapus' });
}

module.exports = { uploadGambar, getGambarByMobil, removeGambar };