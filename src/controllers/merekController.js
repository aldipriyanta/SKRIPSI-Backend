const { Merek } = require('../models');

async function getAll(req, res) {
  const merek = await Merek.findAll();
  return res.status(200).json({ data: merek });
}

async function create(req, res) {
  const { nama_merek } = req.body;
  if (!nama_merek) return res.status(400).json({ message: 'nama_merek wajib diisi' });
  const merek = await Merek.create({ nama_merek });
  return res.status(201).json({ message: 'Merek berhasil ditambahkan', data: merek });
}

module.exports = { getAll, create };