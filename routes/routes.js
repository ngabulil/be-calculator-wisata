const hotelRoutes = require('./hotel/index');
const villaRoutes = require('./villa/index');
const akomodasiRoutes = require('./akomodasi/index');
const transportRoutes = require('./transport/index');
const mobilRoutes = require('./mobil/index');
const router = require('express').Router();

router.use('/hotels', hotelRoutes);
router.use('/villas', villaRoutes);
router.use('/akomodasi', akomodasiRoutes);
router.use('/transport', transportRoutes);
router.use('/mobil', mobilRoutes);

module.exports = router;