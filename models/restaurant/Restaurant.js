const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Restaurant = sequelize.define('Restaurant', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'restaurant',
  timestamps: true,
  paranoid: true
});

module.exports = Restaurant;
