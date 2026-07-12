const { Mobil } = require('../models');

async function getAll(req, res) {
  const mobil = await Mobil.findAll();
  return res.status(200).json({ data: mobil });
}

async function getById(req, res) {
  const mobil = await Mobil.findByPk(req.params.id);
  if (!mobil) return res.status(404).json({ message: 'Data mobil tidak ditemukan' });
  return res.status(200).json({ data: mobil });
}

async function create(req, res) {
  const { nama_mobil, merek, kategori, harga } = req.body;
  if (!nama_mobil || !merek || !kategori || !harga) {
    return res.status(400).json({ message: 'nama_mobil, merek, kategori, dan harga wajib diisi' });
  }
  const mobil = await Mobil.create({ ...req.body, id_admin: req.admin.id_admin });
  return res.status(201).json({ message: 'Data mobil berhasil ditambahkan', data: mobil });
}

async function update(req, res) {
  const mobil = await Mobil.findByPk(req.params.id);
  if (!mobil) return res.status(404).json({ message: 'Data mobil tidak ditemukan' });
  await mobil.update(req.body);
  return res.status(200).json({ message: 'Data mobil berhasil diperbarui', data: mobil });
}

async function remove(req, res) {
  const mobil = await Mobil.findByPk(req.params.id);
  if (!mobil) return res.status(404).json({ message: 'Data mobil tidak ditemukan' });
  await mobil.destroy();
  return res.status(200).json({ message: 'Data mobil berhasil dihapus' });
}

module.exports = { getAll, getById, create, update, remove };