const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Mobil = sequelize.define('Mobil', {
  id_mobil: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_admin: { type: DataTypes.INTEGER, allowNull: false },
  nama_mobil: { type: DataTypes.STRING, allowNull: false },
  merek: { type: DataTypes.STRING, allowNull: false },
  kategori: { type: DataTypes.STRING, allowNull: false },
  tipe: DataTypes.STRING,
  tahun: DataTypes.INTEGER,
  transmisi: DataTypes.STRING,
  bahan_bakar: DataTypes.STRING,
  kilometer: DataTypes.INTEGER,
  harga: { type: DataTypes.DECIMAL(15, 2), allowNull: false },
  deskripsi: DataTypes.TEXT,
  status_stok: { type: DataTypes.STRING, defaultValue: 'tersedia' },
}, {
  tableName: 'mobil',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: 'updated_at',
});

module.exports = Mobil;