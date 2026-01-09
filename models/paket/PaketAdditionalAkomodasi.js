const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PaketAdditionalAkomodasi = sequelize.define('PaketAdditionalAkomodasi', {
  paket_day_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_additional: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'paket_additional_akomodasi',
  timestamps: true,
  paranoid: true
});

module.exports = PaketAdditionalAkomodasi;
