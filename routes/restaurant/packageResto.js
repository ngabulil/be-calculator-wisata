const express = require('express');
const router = express.Router();

const {
  createPackageResto,
  updatePackageResto,
  deletePackageResto,
  getPackageRestoById,
  getAllPackageRestos,
} = require('../../controllers/restaurant/packageRestoControllers');

const auth = require('../../middlewares/authMiddleware'); // JWT middleware

// ✅ PUBLIC ROUTES
router.get('/', getAllPackageRestos);            // Get all package restos
router.get('/:id', getPackageRestoById);         // Get by ID

// 🔒 PROTECTED ROUTES
router.post('/', auth, createPackageResto);      // Create new package
router.put('/:id', auth, updatePackageResto);    // Update package
router.delete('/:id', auth, deletePackageResto); // Delete package

module.exports = router;
