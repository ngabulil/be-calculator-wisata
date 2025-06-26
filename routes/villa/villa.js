const express = require('express');
const router = express.Router();

const {
    createVilla,
    getAllVillas,
    getVillaById,
    updateVilla,
    deleteVilla,
    getAllVillasFull,
    createVillaFull,
    deleteVillaFull
} = require('../../controllers/villa/villaControllers');


// CRUD Routes
router.post('/', createVilla);             // Create Villa
router.get('/', getAllVillas);             // Get all Villas
router.get('/full', getAllVillasFull); // Get all Villas with full season + room data
router.post('/full', createVillaFull);
router.delete('/full/:id', deleteVillaFull);
router.get('/:id', getVillaById);          // Get Villa by ID
router.put('/:id', updateVilla);           // Update Villa
router.delete('/:id', deleteVilla);        // Delete Villa

module.exports = router;
