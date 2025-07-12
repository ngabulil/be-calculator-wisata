const { Admin } = require('../admin');
const pesanan = require('./Pesanan');

Admin.hasMany(pesanan, {
  foreignKey: 'id_admin',
  as: 'pesanan'
});

// Relasi: Pesanan milik satu Admin
pesanan.belongsTo(Admin, {
  foreignKey: 'id_admin',
  as: 'admin'
});

module.exports = {
    pesanan
}