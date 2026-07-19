const { Kategori } = require('../models');

async function getAll(req, res) {
  const kategori = await Kategori.findAll();
  return res.status(200).json({ data: kategori });
}

async function create(req, res) {
  const { nama_kategori } = req.body;
  if (!nama_kategori) return res.status(400).json({ message: 'nama_kategori wajib diisi' });
  const kategori = await Kategori.create({ nama_kategori });
  return res.status(201).json({ message: 'Kategori berhasil ditambahkan', data: kategori });
}

module.exports = { getAll, create };