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

// 🟡 Full data (dengan packages)
router.get('/full', getAllRestoFull);     // Get semua restoran + packages
router.post('/full', createFullResto);        // Create restoran + packages
router.put('/full/:id', updateFullResto);     // Update restoran + packages
router.delete('/full/:id', deleteFullResto);  // Delete restoran + packages

// 🟢 CRUD sederhana
router.post('/', createRestaurant);           // Create restoran
router.get('/', getAllRestaurants);           // Get semua restoran
router.get('/:id', getRestaurantById);        // Get restoran by ID
router.put('/:id', updateRestaurant);         // Update restoran
router.delete('/:id', deleteRestaurant);      // Delete restoran

module.exports = router;
