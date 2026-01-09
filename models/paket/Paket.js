const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Paket = sequelize.define('Paket', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  created_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  updated_by: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
}, {
  tableName: 'paket',
  timestamps: true,
  paranoid: true
});

module.exports = Paket;
