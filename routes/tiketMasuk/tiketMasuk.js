const express = require('express');
const router = express.Router();
const {
  createTiketMasuk,
  updateTiketMasuk,
  deleteTiketMasuk,
  getTiketMasukById,
  getAllTiketMasuk,
} = require('../../controllers/tiketMasuk/tiketMasukController');

// CRUD Routes
router.post('/', createTiketMasuk);         // Create Tiket Masuk
router.get('/', getAllTiketMasuk);          // Get all Tiket Masuk
router.get('/:id', getTiketMasukById);      // Get Tiket Masuk by ID
router.put('/:id', updateTiketMasuk);       // Update Tiket Masuk
router.delete('/:id', deleteTiketMasuk);    // Delete Tiket Masuk

module.exports = router;
