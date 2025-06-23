const express = require('express');
const router = express.Router();

const {
  addHighSeason,
  getAllHighSeasons,
  getHighSeasonById,
  updateHighSeason,
  deleteHighSeason
} = require('../../controllers/villa/highSeasonController');

// CRUD HighSeason
router.post('/', addHighSeason);               // Create high season
router.get('/', getAllHighSeasons);            // Get all high seasons
router.get('/:id', getHighSeasonById);         // Get high season by ID
router.put('/:id', updateHighSeason);          // Update high season
router.delete('/:id', deleteHighSeason);       // Delete high season

module.exports = router;
