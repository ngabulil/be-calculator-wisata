const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const AuditLog = sequelize.define('AuditLog', {
  admin_id: {
    type: DataTypes.INTEGER, // samakan dengan PK admin kamu
    allowNull: true,
  },

  action: {
    type: DataTypes.STRING(10), // POST / PUT / DELETE
    allowNull: false,
  },

  path: {
    type: DataTypes.TEXT,
    allowNull: false,
  },

  status_code: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },

  ip: {
    type: DataTypes.STRING,
    allowNull: true,
  },

  user_agent: {
    type: DataTypes.TEXT,
    allowNull: true,
  },

  body: {
    type: DataTypes.JSONB,
    allowNull: true,
  },

  message: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'audit_logs',
  timestamps: true,
});

module.exports = AuditLog;
