const express = require('express');
const router = express.Router();

const {
  createActivityDetail,
  getAllActivityDetails,
  getActivityDetailById,
  updateActivityDetail,
  deleteActivityDetail
} = require('../../controllers/activity/activityDetailControllers');

const auth = require('../../middlewares/authMiddleware'); // JWT auth

// ✅ PUBLIC ROUTES
router.get('/', getAllActivityDetails);           // Get all activity details
router.get('/:id', getActivityDetailById);        // Get activity detail by ID

// 🔒 PROTECTED ROUTES
router.post('/', auth, createActivityDetail);     // Create activity detail
router.put('/:id', auth, updateActivityDetail);   // Update activity detail
router.delete('/:id', auth, deleteActivityDetail);// Delete activity detail

module.exports = router;
