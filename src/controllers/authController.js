const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { Admin } = require('../models');

async function login(req, res) {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username dan password wajib diisi' });
  }

  const admin = await Admin.findOne({ where: { username } });
  if (!admin) return res.status(401).json({ message: 'Username atau password salah' });

  const isValid = await bcrypt.compare(password, admin.password);
  if (!isValid) return res.status(401).json({ message: 'Username atau password salah' });

  const token = jwt.sign(
    { id_admin: admin.id_admin, username: admin.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '1d' }
  );

  return res.status(200).json({
    message: 'Login berhasil',
    token,
    admin: { id_admin: admin.id_admin, nama: admin.nama, username: admin.username },
  });
}

module.exports = { login };