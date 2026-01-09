const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const NormalSeason = sequelize.define('NormalSeason', {
  id_hotel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_tipe_room: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  }
}, {
  tableName: 'normalseason',
  timestamps: true,
  paranoid: true
});

module.exports = NormalSeason;
