const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Fullday = sequelize.define('Fullday', {
  id_mobil: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  area_name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'fullday',
  timestamps: true,
});

module.exports = Fullday;
