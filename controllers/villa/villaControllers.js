const { Villa, TypeRoom, NormalSeason, HighSeason, PeakSeason, Honeymoon } = require('../../models/villa/index');
const { formatResponse } = require('../../utils/formatResponse');

// 🔹 Get All Villas
const getAllVillasFull = async (req, res) => {
  try {
    const villas = await Villa.findAll({
      include: {
        model: TypeRoom,
        as: 'rooms',
        include: [
          { model: NormalSeason, as: 'normalseasons' },
          { model: HighSeason, as: 'highseasons' },
          { model: PeakSeason, as: 'peakseasons' },
          { model: Honeymoon, as: 'honeymoons' }
        ]
      }
    });

    const result = villas.map(villa => {
      return {
        id: villa.id,
        villaName: villa.name,
        stars: villa.star,
        photoLink: villa.link_photo,
        additionalLink: villa.link_additional,
        roomType: villa.rooms.map(room => ({
          idRoom: room.id,
          label: room.name
        })),
        seasons: {
          normal: villa.rooms.flatMap(room =>
            room.normalseasons.map(ns => ({
              idRoom: room.id,
              price: ns.price,
            }))
          ),
          high: villa.rooms.flatMap(room =>
            room.highseasons.map(hs => ({
              idRoom: room.id,
              label: hs.name,
              price: hs.price
            }))
          ),
          peak: villa.rooms.flatMap(room =>
            room.peakseasons.map(ps => ({
              idRoom: room.id,
              label: ps.name,
              price: ps.price
            }))
          ),
          honeymoon: villa.rooms.flatMap(room =>
            room.honeymoons.map(hs => ({
              idRoom: room.id,
              price: hs.price
            }))
          )
        },
        extrabed: villa.rooms.map(room => ({
          idRoom: room.id,
          price: room.extrabed_price
        })),
        additional: villa.rooms.map(room => ({
          idRoom: room.id,
          additional: room.additional
        })),
        contractUntil: villa.rooms.map(room => ({
          idRoom: room.id,
          valid: room.contract_limit
        }))
      };
    });

    formatResponse(res, 200, "All villas with full data fetched", result);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Create Villa
const createVilla = async (req, res) => {
  const { name, star, link_photo, link_additional } = req.body;

  try {
    const newVilla = await Villa.create({ name, star, link_photo, link_additional });
    formatResponse(res, 201, 'Villa created successfully', newVilla);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Get All Villas
const getAllVillas = async (req, res) => {
  try {
    const villas = await Villa.findAll();
    formatResponse(res, 200, 'All villas fetched successfully', villas);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Get Villa by ID
const getVillaById = async (req, res) => {
  const { id } = req.params;

  try {
    const villa = await Villa.findByPk(id);
    if (!villa) return formatResponse(res, 404, 'Villa not found', null);

    formatResponse(res, 200, 'Villa found', villa);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Update Villa
const updateVilla = async (req, res) => {
  const { id } = req.params;
  const { name, star, link_photo, link_additional } = req.body;

  try {
    const villa = await Villa.findByPk(id);
    if (!villa) return formatResponse(res, 404, 'Villa not found', null);

    await villa.update({ name, star, link_photo, link_additional });
    formatResponse(res, 200, 'Villa updated successfully', villa);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Delete Villa
const deleteVilla = async (req, res) => {
  const { id } = req.params;

  try {
    const villa = await Villa.findByPk(id);
    if (!villa) return formatResponse(res, 404, 'Villa not found', null);

    await villa.destroy();
    formatResponse(res, 200, 'Villa deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  createVilla,
  getAllVillas,
  getVillaById,
  updateVilla,
  deleteVilla,
  getAllVillasFull
};
