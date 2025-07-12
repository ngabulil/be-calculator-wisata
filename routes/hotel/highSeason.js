const express = require('express');
const router = express.Router();

const {
  addHighSeason,
  getAllHighSeasons,
  getHighSeasonById,
  updateHighSeason,
  deleteHighSeason
} = require('../../controllers/hotel/highSeasonController');

const auth = require('../../middlewares/authMiddleware'); // JWT auth

// ✅ PUBLIC ROUTES
router.get('/', getAllHighSeasons);            // Get all high seasons
router.get('/:id', getHighSeasonById);         // Get high season by ID

// 🔒 PROTECTED ROUTES
router.post('/', auth, addHighSeason);         // Create high season
router.put('/:id', auth, updateHighSeason);    // Update high season
router.delete('/:id', auth, deleteHighSeason); // Delete high season

module.exports = router;
