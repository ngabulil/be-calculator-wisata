const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Hotel = sequelize.define('Hotel', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  star: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  link_photo: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'hotel',
  timestamps: true,
  paranoid: true
});

module.exports = Hotel;
