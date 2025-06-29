const { Halfday } = require('../../models/mobil/index');
const { formatResponse } = require('../../utils/formatResponse');

const createHalfday = async (req, res) => {
  try {
    const { id_mobil, area_name, price } = req.body;
    const data = await Halfday.create({ id_mobil, area_name, price });
    formatResponse(res, 201, 'Halfday created successfully', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const getAllHalfday = async (req, res) => {
  try {
    const data = await Halfday.findAll();
    formatResponse(res, 200, 'List of halfday prices', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const getHalfdayById = async (req, res) => {
  try {
    const data = await Halfday.findByPk(req.params.id);
    if (!data) return formatResponse(res, 404, 'Halfday entry not found', null);
    formatResponse(res, 200, 'Halfday entry found', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const updateHalfday = async (req, res) => {
  try {
    const { id_mobil, area_name, price } = req.body;
    const data = await Halfday.findByPk(req.params.id);
    if (!data) return formatResponse(res, 404, 'Halfday entry not found', null);

    await data.update({ id_mobil, area_name, price });
    formatResponse(res, 200, 'Halfday updated successfully', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const deleteHalfday = async (req, res) => {
  try {
    const data = await Halfday.findByPk(req.params.id);
    if (!data) return formatResponse(res, 404, 'Halfday entry not found', null);

    await data.destroy();
    formatResponse(res, 200, 'Halfday deleted successfully', null);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

module.exports = {
  createHalfday,
  getAllHalfday,
  getHalfdayById,
  updateHalfday,
  deleteHalfday,
};
