const express = require('express');
const router = express.Router();

const {
  createAdmin,
  createSuperAdmin,
  loginAdmin,
  getAllAdmins,
  getAdminById,
  updateAdmin,
  deleteAdmin
} = require('../../controllers/admin/adminControllers');

const auth = require('../../middlewares/authMiddleware');

// PUBLIC ROUTES
router.post('/login', loginAdmin);             // Login
router.post('/super', createSuperAdmin);       // Optional: create super admin (bisa disable setelah setup)

// PROTECTED ROUTES - Only for super_admin
router.use(auth); // JWT required after this line

router.post('/', createAdmin);                 // Create admin (only super_admin can create)
router.get('/', getAllAdmins);                 // Get all admins (only super_admin)
router.get('/:id', getAdminById);              // Get admin by ID (only super_admin)
router.put('/:id', updateAdmin);               // Update admin (only super_admin)
router.delete('/:id', deleteAdmin);            // Delete admin (only super_admin)

module.exports = router;
