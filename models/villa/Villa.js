const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Villa = sequelize.define('Villa', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  star: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  link_photo: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  link_additional: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'villa',
  timestamps: true,
});

module.exports = Villa;
