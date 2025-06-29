const express = require('express');
const router = express.Router();

const {
  createHalfday,
  getAllHalfday,
  getHalfdayById,
  updateHalfday,
  deleteHalfday
} = require('../../controllers/mobil/halfdayControllers');

router.post('/', createHalfday);
router.get('/', getAllHalfday);
router.get('/:id', getHalfdayById);
router.put('/:id', updateHalfday);
router.delete('/:id', deleteHalfday);

module.exports = router;
