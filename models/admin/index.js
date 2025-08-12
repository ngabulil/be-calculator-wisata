const Admin = require('./Admin');
const { Paket } = require('../paket/index');

Admin.hasMany(Paket, { as: 'createdPackages', foreignKey: 'created_by' });
Admin.hasMany(Paket, { as: 'updatedPackages', foreignKey: 'updated_by' });

module.exports = {
    Admin
}