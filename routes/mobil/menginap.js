const express = require('express');
const router = express.Router();

const {
  createMenginap,
  getAllMenginap,
  getMenginapById,
  updateMenginap,
  deleteMenginap
} = require('../../controllers/mobil/menginapControllers');

router.post('/', createMenginap);
router.get('/', getAllMenginap);
router.get('/:id', getMenginapById);
router.put('/:id', updateMenginap);
router.delete('/:id', deleteMenginap);

module.exports = router;
