const ModelsHotel = require('./hotel/index');
const ModelsVilla = require('./villa/index');
const ModelsMobil = require('./mobil/index');
const ModelsAkomodasi = require('./akomodasi/index');
const ModelsTransport = require('./transport/index');
const ModelsPaket = require('./paket/index');
const ModelsRestoran = require('./restaurant/index');
const ModelsActivity = require('./activity/index');
const ModelsTiketMasuk = require('./tiketMasuk/index');
const ModelsPesanan = require('./pesanan/index');
const ModelsAdmin = require('./admin/index');
const ModelAuditLog = require('./logs/index');

module.exports = {
    ModelsHotel,
    ModelsVilla,
    ModelsMobil,
    ModelsTransport,
    ModelsAkomodasi,
    ModelsPaket,
    ModelsRestoran,
    ModelsActivity,
    ModelsTiketMasuk,
    ModelsPesanan,
    ModelsAdmin,
    ModelAuditLog
}