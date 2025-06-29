const express = require('express');
const router = express.Router();

const {
  createInout,
  getAllInout,
  getInoutById,
  updateInout,
  deleteInout
} = require('../../controllers/mobil/inoutControllers');

router.post('/', createInout);
router.get('/', getAllInout);
router.get('/:id', getInoutById);
router.put('/:id', updateInout);
router.delete('/:id', deleteInout);

module.exports = router;
