const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const AdditionalInfo = sequelize.define('AdditionalTransport', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'additionalinfo_transport',
    timestamps: true,
});

module.exports = AdditionalInfo;