const express = require('express');
const router = express.Router();

// Import semua sub-route
const mobilRoutes = require('./mobil');
const fulldayRoutes = require('./fullday');
const halfdayRoutes = require('./halfday');
const inoutRoutes = require('./inout');
const menginapRoutes = require('./menginap');

// Mount ke dalam router
router.use('/fullday', fulldayRoutes);       // /api/mobil/fullday
router.use('/halfday', halfdayRoutes);       // /api/mobil/halfday
router.use('/inout', inoutRoutes);           // /api/mobil/inout
router.use('/menginap', menginapRoutes);     // /api/mobil/menginap
router.use('/', mobilRoutes);                // /api/mobil/

module.exports = router;
