const { Mobil, Merek, Kategori } = require('../models');

const includeRelasi = [
  { model: Merek, attributes: ['id_merek', 'nama_merek'] },
  { model: Kategori, attributes: ['id_kategori', 'nama_kategori'] },
];

async function getAll(req, res) {
  const mobil = await Mobil.findAll({ include: includeRelasi });
  return res.status(200).json({ data: mobil });
}

async function getById(req, res) {
  const mobil = await Mobil.findByPk(req.params.id, { include: includeRelasi });
  if (!mobil) return res.status(404).json({ message: 'Data mobil tidak ditemukan' });
  return res.status(200).json({ data: mobil });
}

async function create(req, res) {
  const { nama_mobil, nama_merek, nama_kategori, harga } = req.body;

  if (!nama_mobil || !nama_merek || !nama_kategori || !harga) {
    return res.status(400).json({
      message: 'nama_mobil, nama_merek, nama_kategori, dan harga wajib diisi',
    });
  }

  const [merek] = await Merek.findOrCreate({ where: { nama_merek: nama_merek.trim() } });
  const [kategori] = await Kategori.findOrCreate({ where: { nama_kategori: nama_kategori.trim() } });

  const { nama_merek: _, nama_kategori: __, ...restBody } = req.body;
  const mobil = await Mobil.create({
    ...restBody,
    id_merek: merek.id_merek,
    id_kategori: kategori.id_kategori,
    id_admin: req.admin.id_admin,
  });
  return res.status(201).json({ message: 'Data mobil berhasil ditambahkan', data: mobil });
}

async function update(req, res) {
  const mobil = await Mobil.findByPk(req.params.id);
  if (!mobil) return res.status(404).json({ message: 'Data mobil tidak ditemukan' });

  const updateData = { ...req.body };

  if (req.body.nama_merek) {
    const [merek] = await Merek.findOrCreate({ where: { nama_merek: req.body.nama_merek.trim() } });
    updateData.id_merek = merek.id_merek;
    delete updateData.nama_merek;
  }
  if (req.body.nama_kategori) {
    const [kategori] = await Kategori.findOrCreate({ where: { nama_kategori: req.body.nama_kategori.trim() } });
    updateData.id_kategori = kategori.id_kategori;
    delete updateData.nama_kategori;
  }

  await mobil.update(updateData);
  return res.status(200).json({ message: 'Data mobil berhasil diperbarui', data: mobil });
}

async function remove(req, res) {
  const mobil = await Mobil.findByPk(req.params.id);
  if (!mobil) return res.status(404).json({ message: 'Data mobil tidak ditemukan' });
  await mobil.destroy();
  return res.status(200).json({ message: 'Data mobil berhasil dihapus' });
}

module.exports = { getAll, getById, create, update, remove };