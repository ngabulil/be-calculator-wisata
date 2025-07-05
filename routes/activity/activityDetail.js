const express = require('express');
const router = express.Router();

const {
  createActivityDetail,
  getAllActivityDetails,
  getActivityDetailById,
  updateActivityDetail,
  deleteActivityDetail
} = require('../../controllers/activity/activityDetailControllers');

// CRUD Routes untuk detail aktivitas (per item aktivitas dari vendor)
router.post('/', createActivityDetail);            // Create activity detail
router.get('/', getAllActivityDetails);            // Get all activity details
router.get('/:id', getActivityDetailById);         // Get activity detail by ID
router.put('/:id', updateActivityDetail);          // Update activity detail
router.delete('/:id', deleteActivityDetail);       // Delete activity detail

module.exports = router;
