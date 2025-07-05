const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PaketHotel = sequelize.define('PaketHotel', {
  paket_day_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_hotel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_tipe_kamar: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  season_type: {
    type: DataTypes.ENUM('normal', 'high', 'peak'),
    allowNull: false,
  },
  id_musim: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'paket_hotel',
  timestamps: true,
});

module.exports = PaketHotel;
