const express = require('express');
const router = express.Router();

const {
  createTypeRoom,
  getAllTypeRooms,
  getTypeRoomById,
  updateTypeRoom,
  deleteTypeRoom
} = require('../../controllers/villa/typeRoomControllers');

const auth = require('../../middlewares/authMiddleware'); // JWT auth middleware

// ✅ PUBLIC ROUTES
router.get('/', getAllTypeRooms);             // Get all type rooms
router.get('/:id', getTypeRoomById);          // Get type room by ID

// 🔒 PROTECTED ROUTES
router.post('/', auth, createTypeRoom);       // Create
router.put('/:id', auth, updateTypeRoom);     // Update
router.delete('/:id', auth, deleteTypeRoom);  // Delete

module.exports = router;
