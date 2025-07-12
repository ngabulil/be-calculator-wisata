const express = require('express');
const router = express.Router();

const {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  getAllHotelsFull,
  createFullHotel,
  deleteHotelFull,
  updateFullHotel
} = require('../../controllers/hotel/hotelControllers');

const auth = require('../../middlewares/authMiddleware'); // JWT auth

// ✅ PUBLIC ROUTES
router.get('/', getAllHotels);                // Get all hotels
router.get('/full', getAllHotelsFull);        // Get full hotel data
router.get('/:id', getHotelById);             // Get single hotel

// 🔒 PROTECTED ROUTES (Login required)
router.post('/', auth, createHotel);          // Create hotel
router.post('/full', auth, createFullHotel);  // Create full hotel with room + season
router.put('/full/:id', auth, updateFullHotel);
router.delete('/full/:id', auth, deleteHotelFull);

router.put('/:id', auth, updateHotel);        // Update hotel
router.delete('/:id', auth, deleteHotel);     // Delete hotel

module.exports = router;
