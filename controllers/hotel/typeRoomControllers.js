const { TypeRoom, Hotel } = require('../../models/hotel/index');
const { formatResponse } = require('../../utils/formatResponse');

// 🔹 Create TypeRoom
const createTypeRoom = async (req, res) => {
  const { id_hotel, name, extrabed_price, contract_limit } = req.body;

  try {
    const newRoom = await TypeRoom.create({
      id_hotel,
      name,
      extrabed_price,
      contract_limit
    });

    formatResponse(res, 201, 'Type room created successfully', newRoom);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Get All TypeRooms
const getAllTypeRooms = async (req, res) => {
  try {
    const rooms = await TypeRoom.findAll({
      include: {
        model: Hotel,
        as: 'hotel'
      }
    });

    formatResponse(res, 200, 'All type rooms fetched successfully', rooms);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Get TypeRoom by ID
const getTypeRoomById = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await TypeRoom.findByPk(id, {
      include: { model: Hotel, as: 'hotel' }
    });

    if (!room) return formatResponse(res, 404, 'Type room not found', null);

    formatResponse(res, 200, 'Type room found', room);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Update TypeRoom
const updateTypeRoom = async (req, res) => {
  const { id } = req.params;
  const { id_hotel, name, extrabed_price, contract_limit } = req.body;

  try {
    const room = await TypeRoom.findByPk(id);
    if (!room) return formatResponse(res, 404, 'Type room not found', null);

    await room.update({
      id_hotel,
      name,
      extrabed_price,
      contract_limit
    });

    formatResponse(res, 200, 'Type room updated successfully', room);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Delete TypeRoom
const deleteTypeRoom = async (req, res) => {
  const { id } = req.params;

  try {
    const room = await TypeRoom.findByPk(id);
    if (!room) return formatResponse(res, 404, 'Type room not found', null);

    await room.destroy();
    formatResponse(res, 200, 'Type room deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  createTypeRoom,
  getAllTypeRooms,
  getTypeRoomById,
  updateTypeRoom,
  deleteTypeRoom
};
