 const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const TypeRoom = sequelize.define('TypeRoomVilla', {
  id_villa: {
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
  additional: {
    type: DataTypes.STRING,
    allowNull: true,
  },
  contract_limit: {
    type: DataTypes.STRING,
    allowNull: true,
  }
}, {
  tableName: 'tipe_room_villa', 
  timestamps: true,
  paranoid: true
});

module.exports = TypeRoom;
