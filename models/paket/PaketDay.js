const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PaketDay = sequelize.define('PaketDay', {
  paket_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description_day: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'paket_day',
  timestamps: true,
  paranoid: true
});

module.exports = PaketDay;
