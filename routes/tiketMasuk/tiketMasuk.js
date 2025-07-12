const express = require('express');
const router = express.Router();

const {
  createTiketMasuk,
  updateTiketMasuk,
  deleteTiketMasuk,
  getTiketMasukById,
  getAllTiketMasuk
} = require('../../controllers/tiketMasuk/tiketMasukController');

const auth = require('../../middlewares/authMiddleware'); // JWT auth

// ✅ PUBLIC ROUTES
router.get('/', getAllTiketMasuk);           // Get all tickets
router.get('/:id', getTiketMasukById);       // Get ticket by ID

// 🔒 PROTECTED ROUTES
router.post('/', auth, createTiketMasuk);    // Create ticket
router.put('/:id', auth, updateTiketMasuk);  // Update ticket
router.delete('/:id', auth, deleteTiketMasuk); // Delete ticket

module.exports = router;
