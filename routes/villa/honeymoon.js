const express = require('express');
const router = express.Router();

const {
  addHoneymoonSeason,
  getAllHoneymoonSeasons,
  getHoneymoonSeasonById,
  updateHoneymoonSeason,
  deleteHoneymoonSeason
} = require('../../controllers/villa/honeymoonController');

// CRUD NormalSeason
router.post('/', addHoneymoonSeason);               // Create honeymoon season
router.get('/', getAllHoneymoonSeasons);            // Get all honeymoon seasons
router.get('/:id', getHoneymoonSeasonById);         // Get honeymoon season by ID
router.put('/:id', updateHoneymoonSeason);          // Update honeymoon season
router.delete('/:id', deleteHoneymoonSeason);       // Delete honeymoon season

module.exports = router;
