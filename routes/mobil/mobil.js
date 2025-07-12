const express = require('express');
const router = express.Router();

const {
  createMobil,
  getAllMobil,
  getMobilById,
  updateMobil,
  deleteMobil,
  getAllMobilFull,
  createFullMobil,
  deleteFullMobil,
  updateFullMobil
} = require('../../controllers/mobil/mobilControllers');

const auth = require('../../middlewares/authMiddleware'); // JWT middleware

// ✅ PUBLIC ROUTES
router.get('/', getAllMobil);                 // Get all mobil
router.get('/full', getAllMobilFull);         // Get full mobil + harga
router.get('/:id', getMobilById);             // Get mobil by ID

// 🔒 PROTECTED ROUTES
router.post('/', auth, createMobil);          // Create mobil only
router.post('/full', auth, createFullMobil);  // Create mobil + harga
router.put('/full/:id', auth, updateFullMobil);
router.delete('/full/:id', auth, deleteFullMobil);

router.put('/:id', auth, updateMobil);        // Update mobil only
router.delete('/:id', auth, deleteMobil);     // Delete mobil only

module.exports = router;
