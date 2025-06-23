const Villa = require('./Villa');
const TypeRoom = require('./TypeRoom');
const HighSeason = require('./HighSeason');
const PeakSeason = require('./PeakSeason');
const NormalSeason = require('./NormalSeason');
const Honeymoon = require('./Honeymoon');

// ✅ Villa - TypeRoom
Villa.hasMany(TypeRoom, { foreignKey: 'id_villa', as: 'rooms' });
TypeRoom.belongsTo(Villa, { foreignKey: 'id_villa', as: 'villa' });

// ✅ HighSeason
Villa.hasMany(HighSeason, { foreignKey: 'id_villa', as: 'highseasons' });
HighSeason.belongsTo(Villa, { foreignKey: 'id_villa', as: 'villa' });
TypeRoom.hasMany(HighSeason, { foreignKey: 'id_tipe_room_villa', as: 'highseasons' });
HighSeason.belongsTo(TypeRoom, { foreignKey: 'id_tipe_room_villa', as: 'roomType' });

// ✅ PeakSeason
Villa.hasMany(PeakSeason, { foreignKey: 'id_villa', as: 'peakseasons' });
PeakSeason.belongsTo(Villa, { foreignKey: 'id_villa', as: 'villa' });
TypeRoom.hasMany(PeakSeason, { foreignKey: 'id_tipe_room_villa', as: 'peakseasons' });
PeakSeason.belongsTo(TypeRoom, { foreignKey: 'id_tipe_room_villa', as: 'roomType' });

// ✅ NormalSeason
Villa.hasMany(NormalSeason, { foreignKey: 'id_villa', as: 'normalseasons' });
NormalSeason.belongsTo(Villa, { foreignKey: 'id_villa', as: 'villa' });
TypeRoom.hasMany(NormalSeason, { foreignKey: 'id_tipe_room_villa', as: 'normalseasons' });
NormalSeason.belongsTo(TypeRoom, { foreignKey: 'id_tipe_room_villa', as: 'roomType' });

// ✅ Honeymoon
Villa.hasMany(Honeymoon, { foreignKey: 'id_villa', as: 'honeymoons' });
Honeymoon.belongsTo(Villa, { foreignKey: 'id_villa', as: 'villa' });
TypeRoom.hasMany(Honeymoon, { foreignKey: 'id_tipe_room_villa', as: 'honeymoons' });
Honeymoon.belongsTo(TypeRoom, { foreignKey: 'id_tipe_room_villa', as: 'roomType' });

module.exports = {
  Villa,
  TypeRoom,
  HighSeason,
  PeakSeason,
  NormalSeason,
  Honeymoon
};
