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
  deleteFullMobil
} = require('../../controllers/mobil/mobilControllers');

// CRUD Routes
router.post('/', createMobil);              // Create mobil
router.get('/', getAllMobil);              // Get all mobil
router.get('/full', getAllMobilFull);      // Get mobil + full harga
router.post('/full', createFullMobil);     // Create mobil + semua harga
router.delete('/full/:id', deleteFullMobil); // Delete mobil + semua harga
router.get('/:id', getMobilById);          // Get mobil by ID
router.put('/:id', updateMobil);           // Update mobil
router.delete('/:id', deleteMobil);        // Delete mobil only

module.exports = router;
