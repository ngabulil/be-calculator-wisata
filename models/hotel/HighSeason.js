const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const HighSeason = sequelize.define('HighSeason', {
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
  tableName: 'highseason',
  timestamps: true,
  paranoid: true
});

module.exports = HighSeason;
