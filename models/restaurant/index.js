const Restaurant = require('./Restaurant');
const PackageResto = require('./PackageResto');

// Relasi: Satu restoran punya banyak paket
Restaurant.hasMany(PackageResto, {
  foreignKey: 'restaurant_id',
  as: 'packages'
});

PackageResto.belongsTo(Restaurant, {
  foreignKey: 'restaurant_id',
  as: 'restaurant'
});

module.exports = {
  Restaurant,
  PackageResto
};
