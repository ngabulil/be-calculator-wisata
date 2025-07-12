const express = require('express');
const router = express.Router();

const {
  addHoneymoonSeason,
  getAllHoneymoonSeasons,
  getHoneymoonSeasonById,
  updateHoneymoonSeason,
  deleteHoneymoonSeason
} = require('../../controllers/villa/honeymoonController');

const auth = require('../../middlewares/authMiddleware'); // JWT auth

// ✅ PUBLIC ROUTES
router.get('/', getAllHoneymoonSeasons);            // Anyone can view list
router.get('/:id', getHoneymoonSeasonById);         // Anyone can view detail

// 🔒 PROTECTED ROUTES
router.post('/', auth, addHoneymoonSeason);         // Must be logged in
router.put('/:id', auth, updateHoneymoonSeason);    // Must be logged in
router.delete('/:id', auth, deleteHoneymoonSeason); // Must be logged in

module.exports = router;
