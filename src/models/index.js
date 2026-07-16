const sequelize = require('../config/database');
const Admin = require('./admin');
const Mobil = require('./mobil');
const GambarMobil = require('./gambarMobil');
const PercakapanChatbot = require('./percakapanChatbot');
const PesanChatbot = require('./pesanChatbot');
const LogPromptChatbot = require('./logPromptChatbot');

Admin.hasMany(Mobil, { foreignKey: 'id_admin' });
Mobil.belongsTo(Admin, { foreignKey: 'id_admin' });

Mobil.hasMany(GambarMobil, { foreignKey: 'id_mobil' });
GambarMobil.belongsTo(Mobil, { foreignKey: 'id_mobil' });

PercakapanChatbot.hasMany(PesanChatbot, { foreignKey: 'id_conversation' });
PesanChatbot.belongsTo(PercakapanChatbot, { foreignKey: 'id_conversation' });

PercakapanChatbot.hasMany(LogPromptChatbot, { foreignKey: 'id_conversation' });
LogPromptChatbot.belongsTo(PercakapanChatbot, { foreignKey: 'id_conversation' });

module.exports = {
  sequelize, Admin, Mobil, GambarMobil,
  PercakapanChatbot, PesanChatbot, LogPromptChatbot,
};