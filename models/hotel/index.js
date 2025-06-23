const Hotel = require('./Hotel');
const TypeRoom = require('./TypeRoom');
const HighSeason = require('./HighSeason');
const PeakSeason = require('./PeakSeason');
const NormalSeason = require('./NormalSeason');

// Relasi Hotel dan TypeRoom
Hotel.hasMany(TypeRoom, { foreignKey: 'id_hotel', as: 'rooms' });
TypeRoom.belongsTo(Hotel, { foreignKey: 'id_hotel', as: 'hotel' });

// HighSeason
Hotel.hasMany(HighSeason, { foreignKey: 'id_hotel', as: 'highseasons' });
HighSeason.belongsTo(Hotel, { foreignKey: 'id_hotel', as: 'hotel' });
TypeRoom.hasMany(HighSeason, { foreignKey: 'id_tipe_room', as: 'highseasons' });
HighSeason.belongsTo(TypeRoom, { foreignKey: 'id_tipe_room', as: 'roomType' });

// PeakSeason
Hotel.hasMany(PeakSeason, { foreignKey: 'id_hotel', as: 'peakseasons' });
PeakSeason.belongsTo(Hotel, { foreignKey: 'id_hotel', as: 'hotel' });
TypeRoom.hasMany(PeakSeason, { foreignKey: 'id_tipe_room', as: 'peakseasons' });
PeakSeason.belongsTo(TypeRoom, { foreignKey: 'id_tipe_room', as: 'roomType' });

// ✅ NormalSeason
Hotel.hasMany(NormalSeason, { foreignKey: 'id_hotel', as: 'normalseasons' });
NormalSeason.belongsTo(Hotel, { foreignKey: 'id_hotel', as: 'hotel' });

TypeRoom.hasMany(NormalSeason, { foreignKey: 'id_tipe_room', as: 'normalseasons' });
NormalSeason.belongsTo(TypeRoom, { foreignKey: 'id_tipe_room', as: 'roomType' });

module.exports = {
  Hotel,
  TypeRoom,
  HighSeason,
  PeakSeason,
  NormalSeason
};
