const { Inout } = require('../../models/mobil/index');
const { formatResponse } = require('../../utils/formatResponse');

const createInout = async (req, res) => {
  try {
    const { id_mobil, area_name, price } = req.body;
    const data = await Inout.create({ id_mobil, area_name, price });
    formatResponse(res, 201, 'Inout created successfully', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const getAllInout = async (req, res) => {
  try {
    const data = await Inout.findAll();
    formatResponse(res, 200, 'List of inout prices', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const getInoutById = async (req, res) => {
  try {
    const data = await Inout.findByPk(req.params.id);
    if (!data) return formatResponse(res, 404, 'Inout entry not found', null);
    formatResponse(res, 200, 'Inout entry found', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const updateInout = async (req, res) => {
  try {
    const { id_mobil, area_name, price } = req.body;
    const data = await Inout.findByPk(req.params.id);
    if (!data) return formatResponse(res, 404, 'Inout entry not found', null);

    await data.update({ id_mobil, area_name, price });
    formatResponse(res, 200, 'Inout updated successfully', data);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

const deleteInout = async (req, res) => {
  try {
    const data = await Inout.findByPk(req.params.id);
    if (!data) return formatResponse(res, 404, 'Inout entry not found', null);

    await data.destroy();
    formatResponse(res, 200, 'Inout deleted successfully', null);
  } catch (error) {
    formatResponse(res, 500, error.message, null);
  }
};

module.exports = {
  createInout,
  getAllInout,
  getInoutById,
  updateInout,
  deleteInout,
};
