const adminRoutes = require('./admin');
const router = require('express').Router();

router.use('/', adminRoutes);                   // /api/akomodasi/additionals

module.exports = router;