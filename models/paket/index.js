const Paket = require('./Paket');
const PaketDay = require('./PaketDay');
const PaketHotel = require('./PaketHotel');
const PaketVilla = require('./PaketVilla');
const PaketAdditionalAkomodasi = require('./PaketAdditionalAkomodasi');
const PaketRestoran = require('./PaketRestoran');
const PaketDestinasi = require('./PaketDestinasi');
const PaketAktivitas = require('./PaketAktivitas');
const PaketTransportMobil = require('./PaketTransportMobil');
const PaketTransportAdditional = require('./PaketTransportAdditional');


// Relasi: 1 Paket punya banyak Hari
Paket.hasMany(PaketDay, {
    foreignKey: 'paket_id',
    as: 'days',
});

PaketDay.belongsTo(Paket, {
    foreignKey: 'paket_id',
    as: 'paket',
});

// Relasi: 1 Hari punya banyak Hotel
PaketDay.hasMany(PaketHotel, {
    foreignKey: 'paket_day_id',
    as: 'hotels',
});

PaketHotel.belongsTo(PaketDay, {
    foreignKey: 'paket_day_id',
    as: 'day',
});

// Relasi: 1 Hari punya banyak Villa
PaketDay.hasMany(PaketVilla, {
    foreignKey: 'paket_day_id',
    as: 'villas',
});

PaketVilla.belongsTo(PaketDay, {
    foreignKey: 'paket_day_id',
    as: 'day',
});

// Relasi: 1 Hari punya banyak Akomodasi Tambahan
PaketDay.hasMany(PaketAdditionalAkomodasi, {
    foreignKey: 'paket_day_id',
    as: 'akomodasi_additionals',
});

PaketAdditionalAkomodasi.belongsTo(PaketDay, {
    foreignKey: 'paket_day_id',
    as: 'day',
});

PaketDay.hasMany(PaketDestinasi, {
    foreignKey: 'paket_day_id',
    as: 'destinations',
});
PaketDestinasi.belongsTo(PaketDay, {
    foreignKey: 'paket_day_id',
    as: 'day',
});

PaketDay.hasMany(PaketAktivitas, {
    foreignKey: 'paket_day_id',
    as: 'activities',
});
PaketAktivitas.belongsTo(PaketDay, {
    foreignKey: 'paket_day_id',
    as: 'day',
});

PaketDay.hasMany(PaketRestoran, {
    foreignKey: 'paket_day_id',
    as: 'restaurants',
});
PaketRestoran.belongsTo(PaketDay, {
    foreignKey: 'paket_day_id',
    as: 'day',
});

PaketDay.hasMany(PaketTransportMobil, {
    foreignKey: 'paket_day_id',
    as: 'mobils',
});
PaketTransportMobil.belongsTo(PaketDay, {
    foreignKey: 'paket_day_id',
    as: 'day',
});

// Relasi: 1 Hari punya banyak Transport Additional
PaketDay.hasMany(PaketTransportAdditional, {
    foreignKey: 'paket_day_id',
    as: 'transport_additionals',
});
PaketTransportAdditional.belongsTo(PaketDay, {
    foreignKey: 'paket_day_id',
    as: 'day',
});

module.exports = {
    Paket,
    PaketDay,
    PaketHotel,
    PaketVilla,
    PaketAdditionalAkomodasi,
    PaketDestinasi,
    PaketAktivitas,
    PaketRestoran,
    PaketTransportMobil,
    PaketTransportAdditional,
};