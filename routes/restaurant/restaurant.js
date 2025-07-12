const express = require('express');
const router = express.Router();

const {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getAllRestaurants,
  getAllRestoFull,
  createFullResto,
  deleteFullResto,
  updateFullResto
} = require('../../controllers/restaurant/restaurantControllers');

const auth = require('../../middlewares/authMiddleware'); // JWT middleware

// ✅ PUBLIC ROUTES
router.get('/full', getAllRestoFull);            // Get all restaurants with packages
router.get('/', getAllRestaurants);              // Get simple list
router.get('/:id', getRestaurantById);           // Get by ID

// 🔒 PROTECTED ROUTES
router.post('/full', auth, createFullResto);     // Create full resto
router.put('/full/:id', auth, updateFullResto);  // Update full resto
router.delete('/full/:id', auth, deleteFullResto); // Delete full resto

router.post('/', auth, createRestaurant);        // Create simple resto
router.put('/:id', auth, updateRestaurant);      // Update simple resto
router.delete('/:id', auth, deleteRestaurant);   // Delete simple resto

module.exports = router;
