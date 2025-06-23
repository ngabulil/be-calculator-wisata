const { NormalSeason, Villa, TypeRoom } = require('../../models/villa/index');
const { formatResponse } = require('../../utils/formatResponse');

// 🔹 Create
const addNormalSeason = async (req, res) => {
  const { id_villa, id_tipe_room_villa, price } = req.body;

  try {
    const newNormalSeason = await NormalSeason.create({
      id_villa,
      id_tipe_room_villa,
      price
    });

    formatResponse(res, 201, 'Normal season created successfully', newNormalSeason);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Read All
const getAllNormalSeasons = async (req, res) => {
  try {
    const seasons = await NormalSeason.findAll({
      include: [
        { model: Villa, as: 'villa' },
        { model: TypeRoom, as: 'roomType' }
      ]
    });

    formatResponse(res, 200, 'All normal seasons fetched successfully', seasons);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Read by ID
const getNormalSeasonById = async (req, res) => {
  const { id } = req.params;

  try {
    const season = await NormalSeason.findByPk(id, {
      include: [
        { model: Villa, as: 'villa' },
        { model: TypeRoom, as: 'roomType' }
      ]
    });

    if (!season) return formatResponse(res, 404, 'Normal season not found', null);

    formatResponse(res, 200, 'Normal season found', season);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Update
const updateNormalSeason = async (req, res) => {
  const { id } = req.params;
  const { id_villa, id_tipe_room_villa, price } = req.body;

  try {
    const season = await NormalSeason.findByPk(id);
    if (!season) return formatResponse(res, 404, 'Normal season not found', null);

    await season.update({ id_villa, id_tipe_room_villa, price });
    formatResponse(res, 200, 'Normal season updated successfully', season);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Delete
const deleteNormalSeason = async (req, res) => {
  const { id } = req.params;

  try {
    const season = await NormalSeason.findByPk(id);
    if (!season) return formatResponse(res, 404, 'Normal season not found', null);

    await season.destroy();
    formatResponse(res, 200, 'Normal season deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  addNormalSeason,
  getAllNormalSeasons,
  getNormalSeasonById,
  updateNormalSeason,
  deleteNormalSeason
};
