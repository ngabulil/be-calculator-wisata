const { Fullday } = require('../../models/mobil/index');
const { formatResponse } = require('../../utils/formatResponse');

const createFullday = async (req, res) => {
  try {
    const { id_mobil, area_name, price } = req.body;
    const data = await Fullday.create({ id_mobil, area_name, price });
    formatResponse(res, 201, 'Fullday created successfully', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const getAllFullday = async (req, res) => {
  try {
    const data = await Fullday.findAll();
    formatResponse(res, 200, 'List of fullday prices', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const getFulldayById = async (req, res) => {
  try {
    const data = await Fullday.findByPk(req.params.id);
    if (!data) return formatResponse(res, 404, 'Fullday entry not found', null);
    formatResponse(res, 200, 'Fullday entry found', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const updateFullday = async (req, res) => {
  try {
    const { id_mobil, area_name, price } = req.body;
    const data = await Fullday.findByPk(req.params.id);
    if (!data) return formatResponse(res, 404, 'Fullday entry not found', null);

    await data.update({ id_mobil, area_name, price });
    formatResponse(res, 200, 'Fullday updated successfully', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const deleteFullday = async (req, res) => {
  try {
    const data = await Fullday.findByPk(req.params.id);
    if (!data) return formatResponse(res, 404, 'Fullday entry not found', null);

    await data.destroy();
    formatResponse(res, 200, 'Fullday deleted successfully', null);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

module.exports = {
  createFullday,
  getAllFullday,
  getFulldayById,
  updateFullday,
  deleteFullday,
};
