const express = require('express');
const router = express.Router();

const {
  createHalfday,
  getAllHalfday,
  getHalfdayById,
  updateHalfday,
  deleteHalfday
} = require('../../controllers/mobil/halfdayControllers');

const auth = require('../../middlewares/authMiddleware'); // JWT middleware

// ✅ PUBLIC ROUTES
router.get('/', getAllHalfday);              // Get all halfday
router.get('/:id', getHalfdayById);          // Get halfday by ID

// 🔒 PROTECTED ROUTES
router.post('/', auth, createHalfday);       // Create halfday
router.put('/:id', auth, updateHalfday);     // Update halfday
router.delete('/:id', auth, deleteHalfday);  // Delete halfday

module.exports = router;
