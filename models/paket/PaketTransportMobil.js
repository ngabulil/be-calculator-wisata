const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PaketTransportMobil = sequelize.define('PaketTransportMobil', {
  paket_day_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_mobil: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  keterangan: {
    type: DataTypes.ENUM('fullday', 'halfday', 'inout', 'menginap'),
    allowNull: false,
  },
  id_area: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'paket_transport_mobil',
  timestamps: true,
});

module.exports = PaketTransportMobil;
