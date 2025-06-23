const { Hotel, TypeRoom, NormalSeason, HighSeason, PeakSeason } = require('../../models/hotel/index');
const { formatResponse } = require('../../utils/formatResponse');

// 🔹 Get All Hotels
const getAllHotelsFull = async (req, res) => {
  try {
    const hotels = await Hotel.findAll({
      include: {
        model: TypeRoom,
        as: 'rooms',
        include: [
          { model: NormalSeason, as: 'normalseasons' },
          { model: HighSeason, as: 'highseasons' },
          { model: PeakSeason, as: 'peakseasons' }
        ]
      }
    });

    const result = hotels.map(hotel => {
      return {
        id: hotel.id,
        hotelName: hotel.name,
        stars: hotel.star,
        photoLink: hotel.link_photo,
        roomType: hotel.rooms.map(room => ({
          idRoom: room.id,
          label: room.name
        })),
        seasons: {
          normal: hotel.rooms.flatMap(room =>
            room.normalseasons.map(ns => ({
              idRoom: room.id,
              price: ns.price,
            }))
          ),
          high: hotel.rooms.flatMap(room =>
            room.highseasons.map(hs => ({
              idRoom: room.id,
              label: hs.name,
              price: hs.price
            }))
          ),
          peak: hotel.rooms.flatMap(room =>
            room.peakseasons.map(ps => ({
              idRoom: room.id,
              label: ps.name,
              price: ps.price
            }))
          )
        },
        extrabed: hotel.rooms.map(room => ({
          idRoom: room.id,
          price: room.extrabed_price
        })),
        contractUntil: hotel.rooms.map(room => ({
          idRoom: room.id,
          valid: room.contract_limit
        }))
      };
    });

    formatResponse(res, 200, "All hotels with full data fetched", result);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Create Hotel
const createHotel = async (req, res) => {
  const { name, star, link_photo } = req.body;

  try {
    const newHotel = await Hotel.create({ name, star, link_photo });
    formatResponse(res, 201, 'Hotel created successfully', newHotel);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Get All Hotels
const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.findAll();
    formatResponse(res, 200, 'All hotels fetched successfully', hotels);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Get Hotel by ID
const getHotelById = async (req, res) => {
  const { id } = req.params;

  try {
    const hotel = await Hotel.findByPk(id);
    if (!hotel) return formatResponse(res, 404, 'Hotel not found', null);

    formatResponse(res, 200, 'Hotel found', hotel);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Update Hotel
const updateHotel = async (req, res) => {
  const { id } = req.params;
  const { name, star, link_photo } = req.body;

  try {
    const hotel = await Hotel.findByPk(id);
    if (!hotel) return formatResponse(res, 404, 'Hotel not found', null);

    await hotel.update({ name, star, link_photo });
    formatResponse(res, 200, 'Hotel updated successfully', hotel);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Delete Hotel
const deleteHotel = async (req, res) => {
  const { id } = req.params;

  try {
    const hotel = await Hotel.findByPk(id);
    if (!hotel) return formatResponse(res, 404, 'Hotel not found', null);

    await hotel.destroy();
    formatResponse(res, 200, 'Hotel deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  createHotel,
  getAllHotels,
  getHotelById,
  updateHotel,
  deleteHotel,
  getAllHotelsFull
};
