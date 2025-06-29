const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Mobil = sequelize.define('Mobil', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vendor: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  vendor_link: {
    type: DataTypes.STRING,
    allowNull: true, // Jika vendor_link opsional, jika wajib ubah ke false
  },
}, {
  tableName: 'mobil',
  timestamps: true,
});

module.exports = Mobil;
