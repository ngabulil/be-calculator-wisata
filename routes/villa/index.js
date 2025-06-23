const express = require('express');
const router = express.Router();

// Import semua sub-route
const villaRoutes = require('./villa');
const typeRoomRoutes = require('./typeRoom');
const highSeasonRoutes = require('./highSeason');
const normalSeasonRoutes = require('./normalSeason');
const peakSeasonRoutes = require('./peakSeason');
const honeymoonRoutes = require('./honeymoon');

// Mount ke dalam router
router.use('/', villaRoutes);                   // /api/villas/
router.use('/rooms', typeRoomRoutes);           // /api/villas/rooms
router.use('/high-seasons', highSeasonRoutes);  // /api/villas/high-seasons
router.use('/normal-seasons', normalSeasonRoutes); // /api/villas/normal-seasons
router.use('/peak-seasons', peakSeasonRoutes);  // /api/villas/peak-seasons
router.use('/honeymoon-seasons', honeymoonRoutes);  // /api/villas/honeymoon-seasons

module.exports = router;
