 const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TypeRoom = sequelize.define('TypeRoom', {
  id_hotel: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  extrabed_price: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  contract_limit: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'tipe_room', // nama tabel di PostgreSQL
  timestamps: true,       // aktifkan createdAt & updatedAt
});

module.exports = TypeRoom;
