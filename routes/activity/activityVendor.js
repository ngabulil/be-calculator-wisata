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

const auth = require('../../middlewares/authMiddleware'); // JWT auth middleware

// ✅ PUBLIC ROUTES
router.get('/', getAllActivityVendors);        // Get all vendors
router.get('/full', getFullActivity);          // Get vendor + all activities
router.get('/:id', getActivityVendorById);     // Get vendor by ID

// 🔒 PROTECTED ROUTES
router.post('/', auth, createActivityVendor);               // Create vendor only
router.post('/full', auth, createFullActivity);             // Create vendor + activities
router.put('/full/:id', auth, updateFullActivity);          // Update full vendor
router.delete('/full/:id', auth, deleteFullActivity);       // Delete vendor + activities
router.put('/:id', auth, updateActivityVendor);             // Update vendor only
router.delete('/:id', auth, deleteActivityVendor);          // Delete vendor only

module.exports = router;
