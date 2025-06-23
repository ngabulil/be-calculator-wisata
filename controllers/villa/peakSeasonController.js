const { PeakSeason, Villa, TypeRoom } = require('../../models/villa/index');
const { formatResponse } = require('../../utils/formatResponse');

// 🔹 Create
const addPeakSeason = async (req, res) => {
  const { id_villa, id_tipe_room_villa, name, price } = req.body;

  try {
    const newPeakSeason = await PeakSeason.create({
      id_villa,
      id_tipe_room_villa,
      name,
      price
    });

    formatResponse(res, 201, 'Peak season created successfully', newPeakSeason);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Read All
const getAllPeakSeasons = async (req, res) => {
  try {
    const seasons = await PeakSeason.findAll({
      include: [
        { model: Villa, as: 'villa' },
        { model: TypeRoom, as: 'roomType' }
      ]
    });

    formatResponse(res, 200, 'All peak seasons fetched successfully', seasons);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Read by ID
const getPeakSeasonById = async (req, res) => {
  const { id } = req.params;

  try {
    const season = await PeakSeason.findByPk(id, {
      include: [
        { model: Villa, as: 'villa' },
        { model: TypeRoom, as: 'roomType' }
      ]
    });

    if (!season) return formatResponse(res, 404, 'Peak season not found', null);

    formatResponse(res, 200, 'Peak season found', season);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Update
const updatePeakSeason = async (req, res) => {
  const { id } = req.params;
  const { id_villa, id_tipe_room_villa, name, price } = req.body;

  try {
    const season = await PeakSeason.findByPk(id);
    if (!season) return formatResponse(res, 404, 'Peak season not found', null);

    await season.update({ id_villa, id_tipe_room_villa, name, price });
    formatResponse(res, 200, 'Peak season updated successfully', season);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Delete
const deletePeakSeason = async (req, res) => {
  const { id } = req.params;

  try {
    const season = await PeakSeason.findByPk(id);
    if (!season) return formatResponse(res, 404, 'Peak season not found', null);

    await season.destroy();
    formatResponse(res, 200, 'Peak season deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  addPeakSeason,
  getAllPeakSeasons,
  getPeakSeasonById,
  updatePeakSeason,
  deletePeakSeason
};
