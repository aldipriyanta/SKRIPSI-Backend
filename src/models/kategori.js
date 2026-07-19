const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Kategori = sequelize.define('Kategori', {
  id_kategori: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama_kategori: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  tableName: 'kategori',
  timestamps: false,
});

module.exports = Kategori;