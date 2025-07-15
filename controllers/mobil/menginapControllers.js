const { Menginap } = require('../../models/mobil/index');
const { formatResponse } = require('../../utils/formatResponse');

const createMenginap = async (req, res) => {
  try {
    const { id_mobil, price, area_name } = req.body;
    const data = await Menginap.create({ id_mobil, area_name, price });
    formatResponse(res, 201, 'Menginap created successfully', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const getAllMenginap = async (req, res) => {
  try {
    const data = await Menginap.findAll();
    formatResponse(res, 200, 'List of menginap prices', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const getMenginapById = async (req, res) => {
  try {
    const data = await Menginap.findByPk(req.params.id);
    if (!data) return formatResponse(res, 404, 'Menginap entry not found', null);
    formatResponse(res, 200, 'Menginap entry found', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const updateMenginap = async (req, res) => {
  try {
    const { id_mobil, price, area_name } = req.body;
    const data = await Menginap.findByPk(req.params.id);
    if (!data) return formatResponse(res, 404, 'Menginap entry not found', null);
    await data.update({ id_mobil, area_name, price });
    formatResponse(res, 200, 'Menginap updated successfully', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const deleteMenginap = async (req, res) => {
  try {
    const data = await Menginap.findByPk(req.params.id);
    if (!data) return formatResponse(res, 404, 'Menginap entry not found', null);

    await data.destroy();
    formatResponse(res, 200, 'Menginap deleted successfully', null);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

module.exports = {
  createMenginap,
  getAllMenginap,
  getMenginapById,
  updateMenginap,
  deleteMenginap,
};
