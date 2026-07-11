const sequelize = require('../config/database');
const Admin = require('./admin');
const Mobil = require('./mobil');

Admin.hasMany(Mobil, { foreignKey: 'id_admin' });
Mobil.belongsTo(Admin, { foreignKey: 'id_admin' });

module.exports = { sequelize, Admin, Mobil };