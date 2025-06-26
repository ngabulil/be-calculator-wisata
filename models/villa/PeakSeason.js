const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PeakSeason = sequelize.define('PeakSeasonVilla', {
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
  tableName: 'peakseason_villa',
  timestamps: true,
});

module.exports = PeakSeason;
