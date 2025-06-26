const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const NormalSeason = sequelize.define('NormalSeasonVilla', {
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
  tableName: 'normalseason_villa',
  timestamps: true,
});

module.exports = NormalSeason;
