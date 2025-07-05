const { ActivityDetail } = require('../../models/activity'); // sesuaikan path jika perlu
const { formatResponse } = require('../../utils/formatResponse');

// CREATE
const createActivityDetail = async (req, res) => {
  try {
    const {
      vendor_id,
      name,
      price_foreign_adult,
      price_foreign_child,
      price_domestic_adult,
      price_domestic_child,
      keterangan,
      note,
      valid,
    } = req.body;

    const newDetail = await ActivityDetail.create({
      vendor_id,
      name,
      price_foreign_adult,
      price_foreign_child,
      price_domestic_adult,
      price_domestic_child,
      keterangan,
      note,
      valid,
    });

    formatResponse(res, 201, 'Activity Detail created successfully', newDetail);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// UPDATE
const updateActivityDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await ActivityDetail.findByPk(id);
    if (!detail) return formatResponse(res, 404, 'Activity Detail not found', null);

    const updatedData = req.body;
    await detail.update(updatedData);

    formatResponse(res, 200, 'Activity Detail updated successfully', detail);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// DELETE
const deleteActivityDetail = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await ActivityDetail.findByPk(id);
    if (!detail) return formatResponse(res, 404, 'Activity Detail not found', null);

    await detail.destroy();
    formatResponse(res, 200, 'Activity Detail deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// GET BY ID
const getActivityDetailById = async (req, res) => {
  try {
    const { id } = req.params;
    const detail = await ActivityDetail.findByPk(id);
    if (!detail) return formatResponse(res, 404, 'Activity Detail not found', null);

    formatResponse(res, 200, 'Activity Detail found', detail);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// GET ALL
const getAllActivityDetails = async (req, res) => {
  try {
    const details = await ActivityDetail.findAll();
    formatResponse(res, 200, 'Activity Details found', details);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  createActivityDetail,
  updateActivityDetail,
  deleteActivityDetail,
  getActivityDetailById,
  getAllActivityDetails,
};
