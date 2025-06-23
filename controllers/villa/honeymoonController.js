const { Honeymoon: HoneymoonSeason, Villa, TypeRoom } = require('../../models/villa/index');
const { formatResponse } = require('../../utils/formatResponse');

// 🔹 Create
const addHoneymoonSeason = async (req, res) => {
  const { id_villa, id_tipe_room_villa, price } = req.body;

  try {
    const newHoneymoonSeason = await HoneymoonSeason.create({
      id_villa,
      id_tipe_room_villa,
      price
    });

    formatResponse(res, 201, 'Honeymoon season created successfully', newHoneymoonSeason);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Read All
const getAllHoneymoonSeasons = async (req, res) => {
  try {
    const seasons = await HoneymoonSeason.findAll({
      include: [
        { model: Villa, as: 'villa' },
        { model: TypeRoom, as: 'roomType' }
      ]
    });

    formatResponse(res, 200, 'All honeymoon seasons fetched successfully', seasons);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Read by ID
const getHoneymoonSeasonById = async (req, res) => {
  const { id } = req.params;

  try {
    const season = await HoneymoonSeason.findByPk(id, {
      include: [
        { model: Villa, as: 'villa' },
        { model: TypeRoom, as: 'roomType' }
      ]
    });

    if (!season) return formatResponse(res, 404, 'Honeymoon season not found', null);

    formatResponse(res, 200, 'Honeymoon season found', season);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Update
const updateHoneymoonSeason = async (req, res) => {
  const { id } = req.params;
  const { id_villa, id_tipe_room_villa, price } = req.body;

  try {
    const season = await HoneymoonSeason.findByPk(id);
    if (!season) return formatResponse(res, 404, 'Honeymoon season not found', null);

    await season.update({ id_villa, id_tipe_room_villa, price });
    formatResponse(res, 200, 'Honeymoon season updated successfully', season);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Delete
const deleteHoneymoonSeason = async (req, res) => {
  const { id } = req.params;

  try {
    const season = await HoneymoonSeason.findByPk(id);
    if (!season) return formatResponse(res, 404, 'Honeymoon season not found', null);

    await season.destroy();
    formatResponse(res, 200, 'Honeymoon season deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  addHoneymoonSeason,
  getAllHoneymoonSeasons,
  getHoneymoonSeasonById,
  updateHoneymoonSeason,
  deleteHoneymoonSeason
};
