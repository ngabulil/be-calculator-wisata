const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Honeymoon = sequelize.define('Honeymoon', {
  id_villa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_tipe_room_villa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'honeymoon_villa',
  timestamps: true,
  paranoid: true
});

module.exports = Honeymoon;
