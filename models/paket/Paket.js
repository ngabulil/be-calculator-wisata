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
}, {
  tableName: 'paket',
  timestamps: true,
});

module.exports = Paket;
