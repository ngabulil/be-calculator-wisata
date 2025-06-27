const { Hotel, TypeRoom, NormalSeason, HighSeason, PeakSeason } = require('../../models/hotel/index');
const { formatResponse } = require('../../utils/formatResponse');

// Delete Full Hotel
const deleteHotelFull = async (req, res) => {
  try {
    const { id } = req.params;

    // 1. Cari hotel
    const hotel = await Hotel.findByPk(id, {
      include: [{ model: TypeRoom, as: 'rooms' }]
    });

    if (!hotel) {
      return res.status(404).json({ message: 'Hotel not found' });
    }

    // 2. Loop semua tipe room yang dimiliki hotel ini
    for (const room of hotel.rooms) {
      const idRoom = room.id;

      // 3. Hapus semua season terkait tipe room
      await HighSeason.destroy({ where: { id_tipe_room: idRoom } });
      await PeakSeason.destroy({ where: { id_tipe_room: idRoom } });
      await NormalSeason.destroy({ where: { id_tipe_room: idRoom } });
    }

    // 4. Hapus semua tipe room
    await TypeRoom.destroy({ where: { id_hotel: hotel.id } });

    // 5. Terakhir, hapus hotel-nya
    await Hotel.destroy({ where: { id: hotel.id } });

    res.status(200).json({ message: 'Hotel and all related data deleted successfully' });
  } catch (error) {
    console.error('Error deleting full hotel:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Create Full Hotel
const createFullHotel = async (req, res) => {
  const {
    hotelName,
    stars,
    photoLink,
    roomType,
    seasons,
    extrabed,
    contractUntil
  } = req.body;

  try {
    // 🔹 1. Create Hotel
    const hotel = await Hotel.create({
      name: hotelName,
      star: stars,
      link_photo: photoLink
    });

    const hotelId = hotel.id;

    // 🔹 2. Create TypeRooms
    const createdRooms = await Promise.all(roomType.map((room) =>
      TypeRoom.create({
        id_hotel: hotelId,
        name: room.label,
        extrabed_price: extrabed.find(e => e.idRoom === room.idRoom)?.price || null,
        contract_limit: contractUntil.find(c => c.idRoom === room.idRoom)?.valid || contractUntil.find(c => c.idRoom === room.idRoom)?.value || null
      })
    ));

    // 🔹 3. Map idRoom → real database id
    const roomMap = createdRooms.reduce((acc, curr, index) => {
      acc[roomType[index].idRoom] = curr.id;
      return acc;
    }, {});

    // 🔹 4. Insert Seasons
    const normalList = seasons.normal.map(n => ({
      id_hotel: hotelId,
      id_tipe_room: roomMap[n.idRoom],
      price: n.price
    }));

    const highList = seasons.high.map(h => ({
      id_hotel: hotelId,
      id_tipe_room: roomMap[h.idRoom],
      name: h.label,
      price: h.price
    }));

    const peakList = seasons.peak.map(p => ({
      id_hotel: hotelId,
      id_tipe_room: roomMap[p.idRoom],
      name: p.label,
      price: p.price
    }));

    await NormalSeason.bulkCreate(normalList);
    await HighSeason.bulkCreate(highList);
    await PeakSeason.bulkCreate(peakList);

    formatResponse(res, 201, 'Hotel and related data created successfully', {
      hotel,
      roomCount: createdRooms.length,
      seasonCount: {
        normal: normalList.length,
        high: highList.length,
        peak: peakList.length
      }
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: err.message });
  }
};

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
  getAllHotelsFull,
  createFullHotel,
  deleteHotelFull
};
