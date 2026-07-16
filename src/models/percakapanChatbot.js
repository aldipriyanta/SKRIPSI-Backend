const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PercakapanChatbot = sequelize.define('PercakapanChatbot', {
  id_conversation: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  session_id: { type: DataTypes.STRING, allowNull: false },
  started_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
  ended_at: DataTypes.DATE,
}, {
  tableName: 'percakapan_chatbot',
  timestamps: false,
});

module.exports = PercakapanChatbot;