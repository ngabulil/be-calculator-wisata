const { Villa, TypeRoom, NormalSeason, HighSeason, PeakSeason, Honeymoon } = require('../../models/villa/index');
const { formatResponse } = require('../../utils/formatResponse');

const updateVillaFull = async (req, res) => {
  const { id } = req.params;
  const {
    villaName,
    stars,
    photoLink,
    additionalLink,
    roomType,
    seasons,
    extrabed,
    contractUntil
  } = req.body;

  const t = await Villa.sequelize.transaction();

  try {
    // 1. Cari villa
    const villa = await Villa.findByPk(id, {
      include: { model: TypeRoom, as: 'rooms' },
      transaction: t
    });

    if (!villa) {
      await t.rollback();
      return formatResponse(res, 404, 'Villa not found', null);
    }

    // 2. Update villa utama
    await villa.update({
      name: villaName,
      star: stars,
      link_photo: photoLink,
      link_additional: additionalLink
    }, { transaction: t });

    // 3. Hapus semua data turunan lama
    for (const room of villa.rooms) {
      await Promise.all([
        NormalSeason.destroy({ where: { id_tipe_room_villa: room.id }, transaction: t }),
        HighSeason.destroy({ where: { id_tipe_room_villa: room.id }, transaction: t }),
        PeakSeason.destroy({ where: { id_tipe_room_villa: room.id }, transaction: t }),
        Honeymoon.destroy({ where: { id_tipe_room_villa: room.id }, transaction: t })
      ]);
    }

    // 4. Hapus semua type room lama
    await TypeRoom.destroy({ where: { id_villa: id }, transaction: t });

    // 5. Masukkan ulang semua room dan season baru
    for (const room of roomType) {
      const roomId = room.idRoom;
      const extrabedItem = extrabed.find(r => r.idRoom === roomId);
      const contractItem = contractUntil.find(r => r.idRoom === roomId);

      const newRoom = await TypeRoom.create({
        id_villa: id,
        name: room.label,
        extrabed_price: extrabedItem?.price || null,
        additional: room.additional || null,
        contract_limit: contractItem?.valid || contractItem?.value || null
      }, { transaction: t });

      const normalItems = seasons.normal.filter(s => s.idRoom === roomId);
      await Promise.all(normalItems.map(s =>
        NormalSeason.create({
          id_villa: id,
          id_tipe_room_villa: newRoom.id,
          price: s.price
        }, { transaction: t })
      ));

      const highItems = seasons.high.filter(s => s.idRoom === roomId);
      await Promise.all(highItems.map(s =>
        HighSeason.create({
          id_villa: id,
          id_tipe_room_villa: newRoom.id,
          name: s.label,
          price: s.price
        }, { transaction: t })
      ));

      const peakItems = seasons.peak.filter(s => s.idRoom === roomId);
      await Promise.all(peakItems.map(s =>
        PeakSeason.create({
          id_villa: id,
          id_tipe_room_villa: newRoom.id,
          name: s.label,
          price: s.price
        }, { transaction: t })
      ));

      const honeymoonItems = seasons.honeymoon?.filter(s => s.idRoom === roomId) || [];
      await Promise.all(honeymoonItems.map(s =>
        Honeymoon.create({
          id_villa: id,
          id_tipe_room_villa: newRoom.id,
          price: s.price
        }, { transaction: t })
      ));
    }

    await t.commit();

    formatResponse(res, 200, 'Villa and related data updated successfully', {
      villa_id: id,
      roomCount: roomType.length,
      seasonsCount: {
        normal: seasons.normal.length,
        high: seasons.high.length,
        peak: seasons.peak.length,
        honeymoon: seasons.honeymoon?.length || 0
      }
    });
  } catch (err) {
    await t.rollback();
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Delete Villa
const deleteVillaFull = async (req, res) => {
  const { id } = req.params;

  try {
    // Cari villa dulu
    const villa = await Villa.findByPk(id, {
      include: {
        model: TypeRoom,
        as: 'rooms',
      }
    });

    if (!villa) {
      return formatResponse(res, 404, 'Villa not found', null);
    }

    // Hapus semua data turunan berdasarkan tiap tipe room
    for (const room of villa.rooms) {
      await Promise.all([
        NormalSeason.destroy({ where: { id_tipe_room_villa: room.id } }),
        HighSeason.destroy({ where: { id_tipe_room_villa: room.id } }),
        PeakSeason.destroy({ where: { id_tipe_room_villa: room.id } }),
        Honeymoon.destroy({ where: { id_tipe_room_villa: room.id } }),
      ]);
    }

    // Hapus type room dan villa
    await TypeRoom.destroy({ where: { id_villa: id } });
    await Villa.destroy({ where: { id } });

    formatResponse(res, 200, 'Villa and related data deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// 🔹 Create Villa Full
const createVillaFull = async (req, res) => {
  try {
    const {
      villaName,
      stars,
      photoLink,
      additionalLink,
      roomType,
      seasons,
      extrabed,
      contractUntil
    } = req.body;

    // 1. Buat villa utama
    const newVilla = await Villa.create({
      name: villaName,
      star: stars,
      link_photo: photoLink,
      link_additional: additionalLink
    });

    // 2. Loop roomType dan masukkan semua data turunan
    for (const room of roomType) {
      const roomId = room.idRoom;

      const extrabedItem = extrabed.find(r => r.idRoom === roomId);
      const contractItem = contractUntil.find(r => r.idRoom === roomId);

      // Additional langsung dari room.additional
      const createdRoom = await TypeRoom.create({
        id_villa: newVilla.id,
        name: room.label,
        extrabed_price: extrabedItem?.price || null,
        additional: room.additional || null,
        contract_limit: contractItem?.valid || contractItem?.value || null
      });

      // ⬇ Season Data
      const normalItems = seasons.normal.filter(s => s.idRoom === roomId);
      await Promise.all(normalItems.map(s =>
        NormalSeason.create({
          id_villa: newVilla.id,
          id_tipe_room_villa: createdRoom.id,
          price: s.price
        })
      ));

      const highItems = seasons.high.filter(s => s.idRoom === roomId);
      await Promise.all(highItems.map(s =>
        HighSeason.create({
          id_villa: newVilla.id,
          id_tipe_room_villa: createdRoom.id,
          name: s.label,
          price: s.price
        })
      ));

      const peakItems = seasons.peak.filter(s => s.idRoom === roomId);
      await Promise.all(peakItems.map(s =>
        PeakSeason.create({
          id_villa: newVilla.id,
          id_tipe_room_villa: createdRoom.id,
          name: s.label,
          price: s.price
        })
      ));

      const honeymoonItems = seasons.honeymoon?.filter(s => s.idRoom === roomId) || [];
      await Promise.all(honeymoonItems.map(s =>
        Honeymoon.create({
          id_villa: newVilla.id,
          id_tipe_room_villa: createdRoom.id,
          price: s.price
        })
      ));
    }

    formatResponse(res, 201, "Villa created with full data", {
      villa: newVilla,
      roomCount: roomType.length,
      seasonsCount: {
        normal: seasons.normal.length || 0,
        high: seasons.high.length || 0,
        peak: seasons.peak.length || 0,
        honeymoon: seasons.honeymoon?.length || 0
      }
    });
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

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
  getAllVillasFull,
  deleteVillaFull,
  createVillaFull,
  updateVillaFull
};
