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
    deleteHotelFull
} = require('../../controllers/hotel/hotelControllers');


// CRUD Routes
router.post('/', createHotel);             // Create hotel
router.get('/', getAllHotels);             // Get all hotels
router.get('/full', getAllHotelsFull); // Get all hotels with full season + room data
router.post('/full', createFullHotel);
router.delete('/full/:id', deleteHotelFull);
router.get('/:id', getHotelById);          // Get hotel by ID
router.put('/:id', updateHotel);           // Update hotel
router.delete('/:id', deleteHotel);        // Delete hotel

module.exports = router;
