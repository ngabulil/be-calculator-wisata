const express = require('express');
const router = express.Router();

const {
  addHighSeason,
  getAllHighSeasons,
  getHighSeasonById,
  updateHighSeason,
  deleteHighSeason
} = require('../../controllers/villa/highSeasonController');

const auth = require('../../middlewares/authMiddleware'); // JWT middleware

// ✅ PUBLIC ROUTES
router.get('/', getAllHighSeasons);            // Anyone can view list
router.get('/:id', getHighSeasonById);         // Anyone can view detail

// 🔒 PROTECTED ROUTES (Login required)
router.post('/', auth, addHighSeason);         // Create high season
router.put('/:id', auth, updateHighSeason);    // Update high season
router.delete('/:id', auth, deleteHighSeason); // Delete high season

module.exports = router;
