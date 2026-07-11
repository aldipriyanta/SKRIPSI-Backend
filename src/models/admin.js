const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Admin = sequelize.define('Admin', {
  id_admin: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  nama: { type: DataTypes.STRING, allowNull: false },
  username: { type: DataTypes.STRING, allowNull: false, unique: true },
  password: { type: DataTypes.STRING, allowNull: false },
  email: { type: DataTypes.STRING, allowNull: false, unique: true },
}, {
  tableName: 'admin',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = Admin;