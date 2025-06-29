const Mobil = require('./Mobil');
const Fullday = require('./FullDay');
const Halfday = require('./HalfDay');
const Inout = require('./InOut');
const Menginap = require('./Menginap');

// Relasi Mobil ke semua jenis layanan
Mobil.hasMany(Fullday, { foreignKey: 'id_mobil', as: 'fullday' });
Fullday.belongsTo(Mobil, { foreignKey: 'id_mobil', as: 'mobil' });

Mobil.hasMany(Halfday, { foreignKey: 'id_mobil', as: 'halfday' });
Halfday.belongsTo(Mobil, { foreignKey: 'id_mobil', as: 'mobil' });

Mobil.hasMany(Inout, { foreignKey: 'id_mobil', as: 'inout' });
Inout.belongsTo(Mobil, { foreignKey: 'id_mobil', as: 'mobil' });

Mobil.hasMany(Menginap, { foreignKey: 'id_mobil', as: 'menginap' });
Menginap.belongsTo(Mobil, { foreignKey: 'id_mobil', as: 'mobil' });

// Export semua model
module.exports = {
  Mobil,
  Fullday,
  Halfday,
  Inout,
  Menginap,
};
