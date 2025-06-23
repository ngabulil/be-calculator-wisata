const { HighSeason, Hotel, TypeRoom } = require('../../models/villa/index');
const { formatResponse } = require('../../utils/formatResponse');

// 🔹 Create
const addHighSeason = async (req, res) => {
  const { id_hotel, id_tipe_room, name, price } = req.body;

  try {
    const newHighSeason = await HighSeason.create({
      id_hotel,
      id_tipe_room,
      name,
      price
    });

    formatResponse(res, 201, 'High season created successfully', newHighSeason);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Read All
const getAllHighSeasons = async (req, res) => {
  try {
    const seasons = await HighSeason.findAll({
      include: [
        { model: Hotel, as: 'hotel' },
        { model: TypeRoom, as: 'roomType' }
      ]
    });

    formatResponse(res, 200, 'All high seasons fetched successfully', seasons);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Read by ID
const getHighSeasonById = async (req, res) => {
  const { id } = req.params;

  try {
    const season = await HighSeason.findByPk(id, {
      include: [
        { model: Hotel, as: 'hotel' },
        { model: TypeRoom, as: 'roomType' }
      ]
    });

    if (!season) return formatResponse(res, 404, 'High season not found', null);

    formatResponse(res, 200, 'High season found', season);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Update
const updateHighSeason = async (req, res) => {
  const { id } = req.params;
  const { id_hotel, id_tipe_room, name, price } = req.body;

  try {
    const season = await HighSeason.findByPk(id);
    if (!season) return formatResponse(res, 404, 'High season not found', null);

    await season.update({ id_hotel, id_tipe_room, name, price });
    formatResponse(res, 200, 'High season updated', season);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Delete
const deleteHighSeason = async (req, res) => {
  const { id } = req.params;

  try {
    const season = await HighSeason.findByPk(id);
    if (!season) return formatResponse(res, 404, 'High season not found', null);

    await season.destroy();
    formatResponse(res, 200, 'High season deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  addHighSeason,
  getAllHighSeasons,
  getHighSeasonById,
  updateHighSeason,
  deleteHighSeason
};
