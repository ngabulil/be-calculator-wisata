const express = require('express');
const router = express.Router();

const {
  createActivityVendor,
  getAllActivityVendors,
  getActivityVendorById,
  updateActivityVendor,
  deleteActivityVendor,
  createFullActivity,
  getFullActivity,
  deleteFullActivity,
  updateFullActivity
} = require('../../controllers/activity/activityVendorControllers');

// CRUD Routes
router.post('/', createActivityVendor);               // Create vendor only
router.get('/', getAllActivityVendors);               // Get all vendors
router.get('/full', getFullActivity);                 // Get vendor + all activities
router.post('/full', createFullActivity);             // Create vendor + activities
router.put('/full/:id', updateFullActivity);          // Update full vendor
router.delete('/full/:id', deleteFullActivity);       // Delete vendor + activities
router.get('/:id', getActivityVendorById);            // Get vendor by ID
router.put('/:id', updateActivityVendor);             // Update vendor only
router.delete('/:id', deleteActivityVendor);          // Delete vendor only

module.exports = router;
