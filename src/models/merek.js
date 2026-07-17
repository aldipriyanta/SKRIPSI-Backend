const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Merek = sequelize.define('Merek', {
  id_merek: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama_merek: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  tableName: 'merek',
  timestamps: false,
});

module.exports = Merek;