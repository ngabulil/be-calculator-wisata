const { DataTypes } = require('sequelize');
const sequelize = require('../../config/db');

const AdditionalInfo = sequelize.define('AdditionalInfo', {
    name: {
        type: DataTypes.STRING,
        allowNull: false,
    },
}, {
    tableName: 'additionalinfo_akomodasi',
    timestamps: true,
});

module.exports = AdditionalInfo;