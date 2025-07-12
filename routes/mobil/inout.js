const express = require('express');
const router = express.Router();

const {
  createInout,
  getAllInout,
  getInoutById,
  updateInout,
  deleteInout
} = require('../../controllers/mobil/inoutControllers');

const auth = require('../../middlewares/authMiddleware'); // JWT middleware

// ✅ PUBLIC ROUTES
router.get('/', getAllInout);              // Get all inout
router.get('/:id', getInoutById);          // Get inout by ID

// 🔒 PROTECTED ROUTES
router.post('/', auth, createInout);       // Create
router.put('/:id', auth, updateInout);     // Update
router.delete('/:id', auth, deleteInout);  // Delete

module.exports = router;
