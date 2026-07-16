const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const LogPromptChatbot = sequelize.define('LogPromptChatbot', {
  id_prompt_log: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  id_conversation: { type: DataTypes.INTEGER, allowNull: false },
  user_question: { type: DataTypes.TEXT, allowNull: false },
  generated_prompt: DataTypes.TEXT,
  ai_response: DataTypes.TEXT,
  ai_status: { type: DataTypes.STRING, defaultValue: 'success' },
}, {
  tableName: 'log_prompt_chatbot',
  timestamps: true,
  createdAt: 'created_at',
  updatedAt: false,
});

module.exports = LogPromptChatbot;