const express = require('express');
const router = express.Router();

const {
  createTypeRoom,
  getAllTypeRooms,
  getTypeRoomById,
  updateTypeRoom,
  deleteTypeRoom
} = require('../../controllers/hotel/typeRoomControllers');

const auth = require('../../middlewares/authMiddleware'); // JWT auth middleware

// PUBLIC (GET routes)
router.get('/', getAllTypeRooms);             // Anyone can view
router.get('/:id', getTypeRoomById);          // Anyone can view by ID

// PROTECTED (admin only)
router.post('/', auth, createTypeRoom);       // Only authenticated admin
router.put('/:id', auth, updateTypeRoom);     // Only authenticated admin
router.delete('/:id', auth, deleteTypeRoom);  // Only authenticated admin

module.exports = router;
