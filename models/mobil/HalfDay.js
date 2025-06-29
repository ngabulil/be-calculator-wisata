const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Halfday = sequelize.define('Halfday', {
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
  tableName: 'halfday',
  timestamps: true,
});

module.exports = Halfday;
