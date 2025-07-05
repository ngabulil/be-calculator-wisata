const router = require('express').Router();
const tiketMasukRoutes = require('./tiketMasuk');

// Prefix: /api/tiket-masuk
router.use('/', tiketMasukRoutes);

module.exports = router;
