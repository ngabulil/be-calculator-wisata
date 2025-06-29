const express = require('express');
const router = express.Router();

const {
  createFullday,
  getAllFullday,
  getFulldayById,
  updateFullday,
  deleteFullday
} = require('../../controllers/mobil/fulldayControllers');

// CRUD Routes
router.post('/', createFullday);             // Create fullday
router.get('/', getAllFullday);              // Get all fullday
router.get('/:id', getFulldayById);          // Get fullday by ID
router.put('/:id', updateFullday);           // Update fullday
router.delete('/:id', deleteFullday);        // Delete fullday

module.exports = router;
