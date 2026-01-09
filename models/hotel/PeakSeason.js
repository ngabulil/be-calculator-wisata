const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PeakSeason = sequelize.define('PeakSeason', {
  id_hotel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_tipe_room: {
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
  tableName: 'peakseason',
  timestamps: true,
  paranoid: true
});

module.exports = PeakSeason;
