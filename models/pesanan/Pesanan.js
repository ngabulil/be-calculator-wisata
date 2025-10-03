// models/pesanan.js
const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const Pesanan = sequelize.define('Pesanan', {
  kode_pesanan: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true
  },
  invoice_pdf: {
    type: DataTypes.STRING,
    allowNull: true
  },
  itinerary_pdf: {
    type: DataTypes.STRING,
    allowNull: true
  },
  id_admin: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  id_paket: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  tableName: 'pesanan',
  timestamps: true
});

module.exports = Pesanan;
