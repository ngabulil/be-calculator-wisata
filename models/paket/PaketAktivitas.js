const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PaketAktivitas = sequelize.define('PaketAktivitas', {
  paket_day_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  no: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_vendor: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_activity: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type_wisata: {
    type: DataTypes.ENUM('domestik', 'asing'),
    allowNull: false,
  },
}, {
  tableName: 'paket_aktivitas',
  timestamps: true,
});

module.exports = PaketAktivitas;
