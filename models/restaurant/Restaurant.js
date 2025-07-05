const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Restaurant = sequelize.define('Restaurant', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'restaurant',
  timestamps: true,
});

module.exports = Restaurant;
