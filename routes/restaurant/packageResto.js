const express = require('express');
const router = express.Router();

const {
  createPackageResto,
  updatePackageResto,
  deletePackageResto,
  getPackageRestoById,
  getAllPackageRestos,
} = require('../../controllers/restaurant/packageRestoControllers');

// CRUD Routes for PackageResto
router.post('/', createPackageResto);            // Create new package
router.get('/', getAllPackageRestos);            // Get all packages
router.get('/:id', getPackageRestoById);         // Get package by ID
router.put('/:id', updatePackageResto);          // Update package
router.delete('/:id', deletePackageResto);       // Delete package

module.exports = router;
