const router = require('express').Router();

const activityVendorRoutes = require('./activityVendor');
const activityDetailRoutes = require('./activityDetail');

// /api/activity/vendors
router.use('/vendors', activityVendorRoutes);

// /api/activity/details
router.use('/details', activityDetailRoutes);

module.exports = router;
