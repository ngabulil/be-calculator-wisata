const express = require('express');
const router = express.Router();

const {
    createHotel,
    getAllHotels,
    getHotelById,
    updateHotel,
    deleteHotel,
    getAllHotelsFull,
    createFullHotel
} = require('../../controllers/hotel/hotelControllers');


// CRUD Routes
router.post('/', createHotel);             // Create hotel
router.get('/', getAllHotels);             // Get all hotels
router.get('/:id', getHotelById);          // Get hotel by ID
router.put('/:id', updateHotel);           // Update hotel
router.delete('/:id', deleteHotel);        // Delete hotel
router.get('/full/all', getAllHotelsFull); // Get all hotels with full season + room data
router.post('/create-full', createFullHotel);

module.exports = router;
