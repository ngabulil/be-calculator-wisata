const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const ActivityDetail = sequelize.define('ActivityDetail', {
  vendor_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
  },
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
    allowNull: true,
  },
  price_foreign_child: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  price_domestic_adult: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  price_domestic_child: {
    type: DataTypes.INTEGER,
    allowNull: true,
  },
  keterangan: {
    type: DataTypes.STRING,
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
}, {
  tableName: 'activity_detail',
  timestamps: true,
  paranoid: true
});

module.exports = ActivityDetail;
