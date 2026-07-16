const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const PesanChatbot = sequelize.define('PesanChatbot', {
  id_message: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_conversation: { type: DataTypes.INTEGER, allowNull: false },
  sender: { type: DataTypes.ENUM('customer', 'bot'), allowNull: false },
  message: { type: DataTypes.TEXT, allowNull: false },
}, {
  tableName: 'pesan_chatbot',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = PesanChatbot;