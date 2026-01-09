const hotelRoutes = require('./hotel/index');
const villaRoutes = require('./villa/index');
const akomodasiRoutes = require('./akomodasi/index');
const transportRoutes = require('./transport/index');
const mobilRoutes = require('./mobil/index');
const paketRoutes = require('./paket/index');
const restaurantRoutes = require('./restaurant/index');
const activityRoutes = require('./activity/index');
const tiketMasukRoutes = require('./tiketMasuk/index');
const pesananRoutes = require('./pesanan/index');
const adminRoutes = require('./admin/index');
const logRoutes = require('./logs/index');
const router = require('express').Router();

router.use('/hotels', hotelRoutes);
router.use('/villas', villaRoutes);
router.use('/akomodasi', akomodasiRoutes);
router.use('/transport', transportRoutes);
router.use('/mobil', mobilRoutes);
router.use('/paket', paketRoutes);
router.use('/restaurant', restaurantRoutes);
router.use('/activity', activityRoutes);
router.use('/tiket-masuk', tiketMasukRoutes);
router.use('/pesanan', pesananRoutes);
router.use('/admin', adminRoutes);
router.use('/logs', logRoutes);

module.exports = router;