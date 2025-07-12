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
  deleteVillaFull,
  updateVillaFull
} = require('../../controllers/villa/villaControllers');

const auth = require('../../middlewares/authMiddleware'); // JWT middleware

// ✅ PUBLIC ROUTES
router.get('/', getAllVillas);                 // Get all villas
router.get('/full', getAllVillasFull);         // Get all villas with full detail
router.get('/:id', getVillaById);              // Get villa by ID

// 🔒 PROTECTED ROUTES (Login required)
router.post('/', auth, createVilla);           // Create villa
router.post('/full', auth, createVillaFull);   // Create full villa
router.put('/full/:id', auth, updateVillaFull);
router.delete('/full/:id', auth, deleteVillaFull);

router.put('/:id', auth, updateVilla);         // Update villa
router.delete('/:id', auth, deleteVilla);      // Delete villa

module.exports = router;
