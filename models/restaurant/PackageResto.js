const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PackageResto = sequelize.define('PackageResto', {
  restaurant_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  price_domestic_adult: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  price_domestic_child: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  price_foreign_adult: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  price_foreign_child: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  pax: {
    type: DataTypes.STRING, // 👈 sekarang string
    allowNull: true,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  valid: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  link_contract: {
    type: DataTypes.STRING,
    allowNull: true,
  },
}, {
  tableName: 'package_resto',
  timestamps: true,
  paranoid: true
});

module.exports = PackageResto;
