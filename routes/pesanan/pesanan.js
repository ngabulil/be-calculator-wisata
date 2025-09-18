const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/uploadMiddleware');
const pesananController = require('../../controllers/pesanan/pesananControllers');
const auth = require('../../middlewares/authMiddleware'); // <-- Import auth middleware

router.use(auth);

router.post(
    '/',
    upload.fields([
        { name: 'invoice', maxCount: 1 },
        { name: 'itinerary', maxCount: 1 }
    ]),
    pesananController.createPesanan
);
router.get('/', pesananController.getAllPesanan);
router.delete('/:id', pesananController.deletePesanan);

module.exports = router;
