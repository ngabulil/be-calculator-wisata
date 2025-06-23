const express = require('express');
const router = express.Router();

// Import semua sub-route
const hotelRoutes = require('./hotel');
const typeRoomRoutes = require('./typeRoom');
const highSeasonRoutes = require('./highSeason');
const normalSeasonRoutes = require('./normalSeason');
const peakSeasonRoutes = require('./peakSeason');

// Mount ke dalam router
router.use('/', hotelRoutes);                   // /api/hotels/
router.use('/rooms', typeRoomRoutes);           // /api/hotels/rooms
router.use('/high-seasons', highSeasonRoutes);  // /api/hotels/high-seasons
router.use('/normal-seasons', normalSeasonRoutes); // /api/hotels/normal-seasons
router.use('/peak-seasons', peakSeasonRoutes);  // /api/hotels/peak-seasons

module.exports = router;
