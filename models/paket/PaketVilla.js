const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PaketVilla = sequelize.define('PaketVilla', {
  paket_day_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_villa: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_tipe_kamar: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  season_type: {
    type: DataTypes.ENUM('normal', 'high', 'peak', 'honeymoon'),
    allowNull: false,
  },
  id_musim: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'paket_villa',
  timestamps: true,
  paranoid: true
});

module.exports = PaketVilla;
