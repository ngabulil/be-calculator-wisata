const express = require('express');
const router = express.Router();

const {
  addPeakSeason,
  getAllPeakSeasons,
  getPeakSeasonById,
  updatePeakSeason,
  deletePeakSeason
} = require('../../controllers/villa/peakSeasonController');

// CRUD PeakSeason
router.post('/', addPeakSeason);               // Create peak season
router.get('/', getAllPeakSeasons);            // Get all peak seasons
router.get('/:id', getPeakSeasonById);         // Get peak season by ID
router.put('/:id', updatePeakSeason);          // Update peak season
router.delete('/:id', deletePeakSeason);       // Delete peak season

module.exports = router;
