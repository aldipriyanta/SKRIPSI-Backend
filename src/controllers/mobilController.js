const { Mobil, Merek, Kategori } = require('../models');

const includeRelasi = [
  { model: Merek, attributes: ['id_merek', 'nama_merek'] },
  { model: Kategori, attributes: ['id_kategori', 'nama_kategori'] },
];

async function getAll(req, res) {
  const mobil = await Mobil.findAll({
    include: includeRelasi,
    order: [['id_mobil', 'DESC']],
  });
  return res.status(200).json({ data: mobil });
}

async function getById(req, res) {
  const mobil = await Mobil.findByPk(req.params.id, { include: includeRelasi });
  if (!mobil) return res.status(404).json({ message: 'Data mobil tidak ditemukan' });
  return res.status(200).json({ data: mobil });
}

async function create(req, res) {
  const { nama_mobil, id_merek, id_kategori, harga } = req.body;

  if (!nama_mobil || !id_merek || !id_kategori || !harga) {
    return res.status(400).json({
      message: 'nama_mobil, id_merek, id_kategori, dan harga wajib diisi',
    });
  }

  const [merek, kategori] = await Promise.all([
    Merek.findByPk(id_merek),
    Kategori.findByPk(id_kategori),
  ]);
  if (!merek) return res.status(400).json({ message: 'id_merek tidak valid' });
  if (!kategori) return res.status(400).json({ message: 'id_kategori tidak valid' });

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