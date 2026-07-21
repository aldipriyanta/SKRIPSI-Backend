const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const GambarMobil = sequelize.define('GambarMobil', {
  id_gambar: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_mobil: { type: DataTypes.INTEGER, allowNull: false },
  url_gambar: { type: DataTypes.STRING, allowNull: false },
  keterangan: DataTypes.STRING,
}, {
  tableName: 'gambar_mobil',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = GambarMobil;