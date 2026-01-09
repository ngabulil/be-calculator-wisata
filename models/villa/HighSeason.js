const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const HighSeason = sequelize.define('HighSeasonVilla', {
  id_villa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_tipe_room_villa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'highseason_villa',
  timestamps: true,
  paranoid: true
});

module.exports = HighSeason;
