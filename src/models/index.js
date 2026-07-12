const sequelize = require('../config/database');
const Admin = require('./admin');
const Mobil = require('./mobil');

Admin.hasMany(Mobil, { foreignKey: 'id_admin' });
Mobil.belongsTo(Admin, { foreignKey: 'id_admin' });

mobil.hasMany(GambarMobil, { foreignKey: 'id_mobil' });
GambarMobil.belongsTo(Mobil, { foreignKey: 'id_mobil' });

module.exports = { sequelize, Admin, Mobil };