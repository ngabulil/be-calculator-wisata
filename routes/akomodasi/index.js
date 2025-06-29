const additionalRoutes = require('./additional');
const router = require('express').Router();

router.use('/additional', additionalRoutes);                   // /api/akomodasi/additionals

module.exports = router;