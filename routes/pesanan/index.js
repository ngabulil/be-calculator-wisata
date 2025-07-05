const pesananRoutes = require('./pesanan');
const router = require('express').Router();

router.use('/', pesananRoutes);

module.exports = router;