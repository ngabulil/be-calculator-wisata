const { Admin } = require('../admin');
const { Paket } = require('../paket');
const pesanan = require('./Pesanan');

// relasi admin-pesanan
Admin.hasMany(pesanan, { foreignKey: 'id_admin', as: 'pesanan' });
pesanan.belongsTo(Admin, { foreignKey: 'id_admin', as: 'admin' });

// relasi paket-pesanan
Paket.hasMany(pesanan, { foreignKey: 'id_paket', as: 'pesanan' });
pesanan.belongsTo(Paket, { foreignKey: 'id_paket', as: 'paket' });

module.exports = {
    pesanan
}