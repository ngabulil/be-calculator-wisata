const express = require('express');
const router = express.Router();

const {
  createMenginap,
  getAllMenginap,
  getMenginapById,
  updateMenginap,
  deleteMenginap
} = require('../../controllers/mobil/menginapControllers');

const auth = require('../../middlewares/authMiddleware'); // JWT auth

// ✅ PUBLIC ROUTES
router.get('/', getAllMenginap);               // Get all menginap
router.get('/:id', getMenginapById);           // Get by ID

// 🔒 PROTECTED ROUTES
router.post('/', auth, createMenginap);        // Create
router.put('/:id', auth, updateMenginap);      // Update
router.delete('/:id', auth, deleteMenginap);   // Delete

module.exports = router;
