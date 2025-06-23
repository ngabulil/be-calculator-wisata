const express = require('express');
const router = express.Router();
const {
  createTypeRoom,
  getAllTypeRooms,
  getTypeRoomById,
  updateTypeRoom,
  deleteTypeRoom
} = require('../../controllers/hotel/typeRoomControllers');

// CRUD TypeRoom
router.post('/', createTypeRoom);             // Create type room
router.get('/', getAllTypeRooms);             // Get all type rooms
router.get('/:id', getTypeRoomById);          // Get type room by ID
router.put('/:id', updateTypeRoom);           // Update type room
router.delete('/:id', deleteTypeRoom);        // Delete type room

module.exports = router;
