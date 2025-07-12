const express = require('express');
const router = express.Router();

const {
  addNormalSeason,
  getAllNormalSeasons,
  getNormalSeasonById,
  updateNormalSeason,
  deleteNormalSeason
} = require('../../controllers/villa/normalSeasonController');

const auth = require('../../middlewares/authMiddleware'); // JWT auth middleware

// ✅ PUBLIC ROUTES
router.get('/', getAllNormalSeasons);            // Get all normal seasons
router.get('/:id', getNormalSeasonById);         // Get by ID

// 🔒 PROTECTED ROUTES
router.post('/', auth, addNormalSeason);         // Create
router.put('/:id', auth, updateNormalSeason);    // Update
router.delete('/:id', auth, deleteNormalSeason); // Delete

module.exports = router;
