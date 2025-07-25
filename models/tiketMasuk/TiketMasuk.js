const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TiketMasuk = sequelize.define('TiketMasuk', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
  price_foreign_adult: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price_foreign_child: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price_domestic_adult: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  price_domestic_child: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  note: {
    type: DataTypes.TEXT,
    allowNull: true,
  },
}, {
  tableName: 'tiket_masuk',
  timestamps: true,
});

module.exports = TiketMasuk;
