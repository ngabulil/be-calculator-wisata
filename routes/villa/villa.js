const express = require('express');
const router = express.Router();

const {
    createVilla,
    getAllVillas,
    getVillaById,
    updateVilla,
    deleteVilla,
    getAllVillasFull
} = require('../../controllers/villa/villaControllers');


// CRUD Routes
router.post('/', createVilla);             // Create Villa
router.get('/', getAllVillas);             // Get all Villas
router.get('/:id', getVillaById);          // Get Villa by ID
router.put('/:id', updateVilla);           // Update Villa
router.delete('/:id', deleteVilla);        // Delete Villa
router.get('/full/all', getAllVillasFull); // Get all Villas with full season + room data

module.exports = router;
