const { TiketMasuk } = require('../../models/tiketMasuk');
const { formatResponse } = require('../../utils/formatResponse');

// CREATE
const createTiketMasuk = async (req, res) => {
  try {
    const {
      name,
      price_foreign_adult,
      price_foreign_child,
      price_domestic_adult,
      price_domestic_child,
      note,
    } = req.body;

    const newTiket = await TiketMasuk.create({
      name,
      price_foreign_adult,
      price_foreign_child,
      price_domestic_adult,
      price_domestic_child,
      note,
    });

    formatResponse(res, 201, 'Tiket Masuk created successfully', newTiket);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// UPDATE
const updateTiketMasuk = async (req, res) => {
  try {
    const { id } = req.params;
    const tiket = await TiketMasuk.findByPk(id);
    if (!tiket) return formatResponse(res, 404, 'Tiket Masuk not found', null);

    await tiket.update(req.body);
    formatResponse(res, 200, 'Tiket Masuk updated successfully', tiket);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// DELETE
const deleteTiketMasuk = async (req, res) => {
  try {
    const { id } = req.params;
    const tiket = await TiketMasuk.findByPk(id);
    if (!tiket) return formatResponse(res, 404, 'Tiket Masuk not found', null);

    await tiket.destroy();
    formatResponse(res, 200, 'Tiket Masuk deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// GET BY ID
const getTiketMasukById = async (req, res) => {
  try {
    const { id } = req.params;
    const tiket = await TiketMasuk.findByPk(id);
    if (!tiket) return formatResponse(res, 404, 'Tiket Masuk not found', null);

    formatResponse(res, 200, 'Tiket Masuk found', tiket);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// GET ALL
const getAllTiketMasuk = async (req, res) => {
  try {
    const tikets = await TiketMasuk.findAll();
    formatResponse(res, 200, 'Tiket Masuk found', tikets);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  createTiketMasuk,
  updateTiketMasuk,
  deleteTiketMasuk,
  getTiketMasukById,
  getAllTiketMasuk,
};
