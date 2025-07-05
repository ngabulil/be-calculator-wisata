const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const ActivityVendor = sequelize.define('ActivityVendor', {
  name: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'activity_vendor',
  timestamps: true,
});

module.exports = ActivityVendor;
