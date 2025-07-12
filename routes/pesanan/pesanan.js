const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/uploadMiddleware');
const pesananController = require('../../controllers/pesanan/pesananControllers');
const auth = require('../../middlewares/authMiddleware'); // <-- Import auth middleware

// Protected route: Create pesanan (with PDF upload + admin auth)
router.post(
    '/',
    auth, // <-- auth di sini
    upload.fields([
        { name: 'invoice', maxCount: 1 },
        { name: 'itinerary', maxCount: 1 }
    ]),
    pesananController.createPesanan
);

// Public route: Get all pesanan
router.get('/', pesananController.getAllPesanan);

module.exports = router;
