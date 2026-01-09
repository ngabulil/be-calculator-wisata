const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Inout = sequelize.define('Inout', {
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
  tableName: 'inout',
  timestamps: true,
  paranoid: true
});

module.exports = Inout;
