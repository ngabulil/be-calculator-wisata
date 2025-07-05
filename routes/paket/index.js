const router = require('express').Router();
const paketRoutes = require('./paket');

// Prefix: /api/paket
router.use('/', paketRoutes);

module.exports = router;
