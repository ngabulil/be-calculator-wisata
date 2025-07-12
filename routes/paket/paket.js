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

const auth = require('../../middlewares/authMiddleware'); // JWT auth

// ✅ PUBLIC ROUTES
router.get('/full', getAllFullPackages);       // Get all full paket
router.get('/', getAllPackages);               // Get all simple paket
router.get('/:id', getPackageById);            // Get paket by ID

// 🔒 PROTECTED ROUTES
router.post('/full', auth, createFullPackage);           // Create full paket
router.put('/full/:id', auth, updateFullPackage);        // Update full paket
router.delete('/full/:id', auth, deleteFullPackage);     // Delete full paket

router.post('/', auth, createPackage);           // Create simple paket
router.put('/:id', auth, updatePackage);         // Update simple paket
router.delete('/:id', auth, deletePackage);      // Delete simple paket

module.exports = router;
