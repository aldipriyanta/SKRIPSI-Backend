const sequelize = require('../config/database');
const Admin = require('./admin');
const Merek = require('./merek');
const Kategori = require('./kategori');
const Mobil = require('./mobil');
const GambarMobil = require('./gambarMobil');

Admin.hasMany(Mobil, { foreignKey: 'id_admin' });
Mobil.belongsTo(Admin, { foreignKey: 'id_admin' });

Merek.hasMany(Mobil, { foreignKey: 'id_merek' });
Mobil.belongsTo(Merek, { foreignKey: 'id_merek' });

Kategori.hasMany(Mobil, { foreignKey: 'id_kategori' });
Mobil.belongsTo(Kategori, { foreignKey: 'id_kategori' });

Mobil.hasMany(GambarMobil, { foreignKey: 'id_mobil' });
GambarMobil.belongsTo(Mobil, { foreignKey: 'id_mobil' });

module.exports = { sequelize, Admin, Merek, Kategori, Mobil, GambarMobil };