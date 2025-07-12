const express = require('express');
const router = express.Router();

const {
  createFullday,
  getAllFullday,
  getFulldayById,
  updateFullday,
  deleteFullday
} = require('../../controllers/mobil/fulldayControllers');

const auth = require('../../middlewares/authMiddleware'); // JWT auth

// ✅ PUBLIC ROUTES
router.get('/', getAllFullday);             // Anyone can view
router.get('/:id', getFulldayById);         // Anyone can view detail

// 🔒 PROTECTED ROUTES
router.post('/', auth, createFullday);      // Must be logged in
router.put('/:id', auth, updateFullday);    // Must be logged in
router.delete('/:id', auth, deleteFullday); // Must be logged in

module.exports = router;
