const express = require('express');
const router = express.Router();

const {
  createAdditional,
  updateAdditional,
  deleteAdditional,
  getAdditionalById,
  getAllAdditional
} = require('../../controllers/akomodasi/additionalControllers');

const auth = require('../../middlewares/authMiddleware'); // JWT auth

// ✅ PUBLIC ROUTES
router.get('/', getAllAdditional);            // Get all additional accommodations
router.get('/:id', getAdditionalById);        // Get by ID

// 🔒 PROTECTED ROUTES
router.post('/', auth, createAdditional);     // Create
router.put('/:id', auth, updateAdditional);   // Update
router.delete('/:id', auth, deleteAdditional);// Delete

module.exports = router;
