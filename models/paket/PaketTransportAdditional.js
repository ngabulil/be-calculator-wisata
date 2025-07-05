const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const PaketTransportAdditional = sequelize.define('PaketTransportAdditional', {
  paket_day_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  id_additional: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
}, {
  tableName: 'paket_transport_additional',
  timestamps: true,
});

module.exports = PaketTransportAdditional;
