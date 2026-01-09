const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Menginap = sequelize.define('Menginap', {
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
  tableName: 'menginap',
  timestamps: true,
  paranoid: true
});

module.exports = Menginap;
