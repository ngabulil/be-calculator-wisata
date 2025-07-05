const router = require('express').Router();

const restaurantRoutes = require('./restaurant');
const packageRestoRoutes = require('./packageResto');

// Prefix: /api/restaurant
router.use('/', restaurantRoutes);                // /api/restaurant
router.use('/package-resto', packageRestoRoutes);      // /api/restaurant/packages

module.exports = router;
