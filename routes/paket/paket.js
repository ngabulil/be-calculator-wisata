const express = require('express');
const router = express.Router();

const {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  createFullPackage,
  getAllFullPackages,
  updateFullPackage,
  deleteFullPackage
} = require('../../controllers/paket/paketControllers');

// CRUD Paket Biasa
router.post('/', createPackage);           // Create Paket
router.get('/', getAllPackages);           // Get All Paket
router.get('/:id', getPackageById);        // Get Paket by ID
router.put('/:id', updatePackage);         // Update Paket
router.delete('/:id', deletePackage);      // Delete Paket

// FULL Paket
router.post('/full', createFullPackage);           // Create full paket (nested)
router.get('/full/all', getAllFullPackages);       // Get all full paket
router.put('/full/:id', updateFullPackage);        // Update full paket
router.delete('/full/:id', deleteFullPackage);     // Delete full paket

module.exports = router;
