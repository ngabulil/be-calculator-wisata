const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Admin = sequelize.define('Admin', {
  username: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false
  },
  role: {
    type: DataTypes.ENUM('super_admin', 'admin'),
    allowNull: false,
    defaultValue: 'admin'
  }
}, {
  tableName: 'admin',
  timestamps: true
});

module.exports = Admin;
