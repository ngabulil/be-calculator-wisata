const express = require('express');
const router = express.Router();
const upload = require('../../middlewares/uploadMiddleware');
const pesananController = require('../../controllers/pesanan/pesananControllers');

router.post(
    '/',
    upload.fields([
        { name: 'invoice', maxCount: 1 },
        { name: 'itinerary', maxCount: 1 }
    ]),
    pesananController.createPesanan
);

router.get('/', pesananController.getAllPesanan);

module.exports = router;
