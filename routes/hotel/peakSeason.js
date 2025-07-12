const express = require('express');
const router = express.Router();

const {
  addPeakSeason,
  getAllPeakSeasons,
  getPeakSeasonById,
  updatePeakSeason,
  deletePeakSeason
} = require('../../controllers/hotel/peakSeasonController');

const auth = require('../../middlewares/authMiddleware'); // JWT middleware

// PUBLIC ROUTES
router.get('/', getAllPeakSeasons);            // Anyone can view list
router.get('/:id', getPeakSeasonById);         // Anyone can view by ID

// PROTECTED ROUTES
router.post('/', auth, addPeakSeason);         // Must be logged in
router.put('/:id', auth, updatePeakSeason);    // Must be logged in
router.delete('/:id', auth, deletePeakSeason); // Must be logged in

module.exports = router;
