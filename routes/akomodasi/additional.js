const { createAdditional, updateAdditional, deleteAdditional, getAdditionalById, getAllAdditional } = require('../../controllers/akomodasi/additionalControllers');
const router = require('express').Router();

router.post('/', createAdditional);
router.get('/', getAllAdditional);
router.get('/:id', getAdditionalById);
router.put('/:id', updateAdditional);
router.delete('/:id', deleteAdditional);

module.exports = router;