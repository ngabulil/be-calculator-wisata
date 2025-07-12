const express = require('express');
const router = express.Router();

const {
  addNormalSeason,
  getAllNormalSeasons,
  getNormalSeasonById,
  updateNormalSeason,
  deleteNormalSeason
} = require('../../controllers/hotel/normalSeasonController');

const auth = require('../../middlewares/authMiddleware'); // JWT auth

// PUBLIC ROUTES
router.get('/', getAllNormalSeasons);             // Anyone can view list
router.get('/:id', getNormalSeasonById);          // Anyone can view detail

// PROTECTED ROUTES
router.post('/', auth, addNormalSeason);          // Must be logged in
router.put('/:id', auth, updateNormalSeason);     // Must be logged in
router.delete('/:id', auth, deleteNormalSeason);  // Must be logged in

module.exports = router;
