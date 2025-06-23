const hotelRoutes = require('./hotel/index');
const villaRoutes = require('./villa/index');
const router = require('express').Router();

router.use('/hotels', hotelRoutes);
router.use('/villas', villaRoutes);

module.exports = router;