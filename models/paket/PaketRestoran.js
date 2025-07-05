const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PaketRestoran = sequelize.define('PaketRestoran', {
  paket_day_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_resto: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_menu: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'paket_restoran',
  timestamps: true,
});

module.exports = PaketRestoran;
