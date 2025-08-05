const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PaketDestinasi = sequelize.define('PaketDestinasi', {
  paket_day_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  no: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_destinasi: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  type_wisata: {
    type: DataTypes.ENUM('domestik', 'asing'),
    allowNull: false,
  },
}, {
  tableName: 'paket_destinasi',
  timestamps: true,
});

module.exports = PaketDestinasi;
