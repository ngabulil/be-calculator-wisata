const express = require('express');
const router = express.Router();

const {
  addNormalSeason,
  getAllNormalSeasons,
  getNormalSeasonById,
  updateNormalSeason,
  deleteNormalSeason
} = require('../../controllers/villa/normalSeasonController');

// CRUD NormalSeason
router.post('/', addNormalSeason);               // Create normal season
router.get('/', getAllNormalSeasons);            // Get all normal seasons
router.get('/:id', getNormalSeasonById);         // Get normal season by ID
router.put('/:id', updateNormalSeason);          // Update normal season
router.delete('/:id', deleteNormalSeason);       // Delete normal season

module.exports = router;
