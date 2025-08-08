const {
  Paket,
  PaketDay,
  PaketHotel,
  PaketVilla,
  PaketAdditionalAkomodasi,
  PaketRestoran,
  PaketDestinasi,
  PaketAktivitas,
  PaketTransportMobil,
  PaketTransportAdditional
} = require('../../models/paket');

const { formatResponse } = require('../../utils/formatResponse');

// CREATE
const createPackage = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newPaket = await Paket.create({ name, description });
    formatResponse(res, 201, 'Package created successfully', newPaket);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// READ ALL
const getAllPackages = async (req, res) => {
  try {
    const packages = await Paket.findAll();
    formatResponse(res, 200, 'Packages retrieved successfully', packages);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// READ BY ID
const getPackageById = async (req, res) => {
  try {
    const { id } = req.params;
    const paket = await Paket.findByPk(id);
    if (!paket) return formatResponse(res, 404, 'Package not found', null);
    formatResponse(res, 200, 'Package retrieved successfully', paket);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// UPDATE
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const paket = await Paket.findByPk(id);
    if (!paket) return formatResponse(res, 404, 'Package not found', null);

    await paket.update({ name, description });
    formatResponse(res, 200, 'Package updated successfully', paket);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// DELETE
const deletePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const paket = await Paket.findByPk(id);
    if (!paket) return formatResponse(res, 404, 'Package not found', null);

    await paket.destroy();
    formatResponse(res, 200, 'Package deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// CREATE FULL
const createFullPackage = async (req, res) => {
  const t = await Paket.sequelize.transaction();
  try {
    const { name, description, days } = req.body;
    console.log(req.body);
    

    if (!name || !Array.isArray(days) || days.length === 0) {
      return formatResponse(res, 400, 'Package name and at least one day are required', null);
    }

    const newPaket = await Paket.create({ name, description }, { transaction: t });

    for (const day of days) {
      const newDay = await PaketDay.create({
        paket_id: newPaket.id,
        name: day.name,
        description_day: day.description_day
      }, { transaction: t });

      const data = day.data || {};

      await Promise.all([

        // AKOMODASI
        ...(data.akomodasi?.hotels || []).map(hotel => PaketHotel.create({
          paket_day_id: newDay.id,
          id_hotel: hotel.id_hotel,
          id_tipe_kamar: hotel.id_tipe_kamar,
          season_type: hotel.season?.type,
          id_musim: hotel.season?.id_musim
        }, { transaction: t })),

        ...(data.akomodasi?.villas || []).map(villa => PaketVilla.create({
          paket_day_id: newDay.id,
          id_villa: villa.id_villa,
          id_tipe_kamar: villa.id_tipe_kamar,
          season_type: villa.season?.type,
          id_musim: villa.season?.id_musim
        }, { transaction: t })),

        ...(data.akomodasi?.additional || []).map(add => PaketAdditionalAkomodasi.create({
          paket_day_id: newDay.id,
          id_additional: add.id_additional
        }, { transaction: t })),

        // TOURS — gabungan dari destinasi, aktivitas, restoran
        ...(data.tours || []).map(item => {
          if (item.id_destinasi) {
            return PaketDestinasi.create({
              paket_day_id: newDay.id,
              no: item.no,
              id_destinasi: item.id_destinasi,
              type_wisata: item.type_wisata
            }, { transaction: t });
          }

          if (item.id_activity) {
            return PaketAktivitas.create({
              paket_day_id: newDay.id,
              no: item.no,
              id_vendor: item.id_vendor,
              id_activity: item.id_activity,
              type_wisata: item.type_wisata
            }, { transaction: t });
          }

          if (item.id_resto) {
            return PaketRestoran.create({
              paket_day_id: newDay.id,
              no: item.no,
              id_resto: item.id_resto,
              id_menu: item.id_menu,
              type_wisata: item.type_wisata
            }, { transaction: t });
          }

          return Promise.resolve(); // Ignore if no known type
        }),

        // TRANSPORT
        ...(data.transport?.mobils || []).map(mobil => PaketTransportMobil.create({
          paket_day_id: newDay.id,
          id_mobil: mobil.id_mobil,
          keterangan: mobil.keterangan,
          id_area: mobil.id_area
        }, { transaction: t })),

        ...(data.transport?.additional || []).map(add => PaketTransportAdditional.create({
          paket_day_id: newDay.id,
          id_additional: add.id_additional
        }, { transaction: t }))
      ]);
    }

    await t.commit();
    formatResponse(res, 201, 'Full package created successfully', { id: newPaket.id });

  } catch (err) {
    await t.rollback();
    formatResponse(res, 500, err.message, null);
  }
};

// GET ALL FULL
const getAllFullPackages = async (req, res) => {
  try {
    const packages = await Paket.findAll({
      include: {
        model: PaketDay,
        as: 'days',
        include: [
          { model: PaketHotel, as: 'hotels' },
          { model: PaketVilla, as: 'villas' },
          { model: PaketAdditionalAkomodasi, as: 'akomodasi_additionals' },
          { model: PaketDestinasi, as: 'destinations' },
          { model: PaketAktivitas, as: 'activities' },
          { model: PaketRestoran, as: 'restaurants' },
          { model: PaketTransportMobil, as: 'mobils' },
          { model: PaketTransportAdditional, as: 'transport_additionals' }
        ]
      }
    });

    // Format ulang hasilnya agar sesuai struktur JSON input
    const formattedPackages = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,
      days: pkg.days.map(day => {
        const tours = [
          ...(day.destinations || []).map(dest => ({
            no: dest.no,
            id_destinasi: dest.id_destinasi,
            type_wisata: dest.type_wisata
          })),
          ...(day.activities || []).map(act => ({
            no: act.no,
            id_vendor: act.id_vendor,
            id_activity: act.id_activity,
            type_wisata: act.type_wisata
          })),
          ...(day.restaurants || []).map(resto => ({
            no: resto.no,
            id_resto: resto.id_resto,
            id_menu: resto.id_menu,
            type_wisata: resto.type_wisata
          }))
        ];

        return {
          id: day.id,
          name: day.name,
          description_day: day.description_day,
          data: {
            akomodasi: {
              hotels: day.hotels || [],
              villas: day.villas || [],
              additional: day.akomodasi_additionals || []
            },
            tours,
            transport: {
              mobils: day.mobils || [],
              additional: day.transport_additionals || []
            }
          }
        };
      })
    }));

    formatResponse(res, 200, 'Full packages retrieved successfully', formattedPackages);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// UPDATE FULL
const updateFullPackage = async (req, res) => {
  const t = await Paket.sequelize.transaction();
  try {
    const { id } = req.params;
    const { name, description, days } = req.body;
    console.log(id);
    console.log(req.body);
    
    if (!name || !Array.isArray(days)) {
      await t.rollback();
      return formatResponse(res, 400, 'Package name and days are required', null);
    }

    const paket = await Paket.findByPk(id, {
      include: { model: PaketDay, as: 'days' },
      transaction: t
    });

    if (!paket) {
      await t.rollback();
      return formatResponse(res, 404, 'Package not found', null);
    }

    // Update header paket
    await paket.update({ name, description }, { transaction: t });

    // Hapus semua relasi dari hari-hari lama
    if (paket.days && paket.days.length > 0) {
      for (const day of paket.days) {
        await Promise.all([
          PaketHotel.destroy({ where: { paket_day_id: day.id }, transaction: t }),
          PaketVilla.destroy({ where: { paket_day_id: day.id }, transaction: t }),
          PaketAdditionalAkomodasi.destroy({ where: { paket_day_id: day.id }, transaction: t }),
          PaketDestinasi.destroy({ where: { paket_day_id: day.id }, transaction: t }),
          PaketAktivitas.destroy({ where: { paket_day_id: day.id }, transaction: t }),
          PaketRestoran.destroy({ where: { paket_day_id: day.id }, transaction: t }),
          PaketTransportMobil.destroy({ where: { paket_day_id: day.id }, transaction: t }),
          PaketTransportAdditional.destroy({ where: { paket_day_id: day.id }, transaction: t }),
          day.destroy({ transaction: t })
        ]);
      }
    }

    // Buat ulang hari-hari baru
    for (const day of days) {
      const newDay = await PaketDay.create({
        paket_id: paket.id,
        name: day.name,
        description_day: day.description_day
      }, { transaction: t });

      const data = day.data || {};

      await Promise.all([

        // AKOMODASI
        ...(data.akomodasi?.hotels || []).map(h => PaketHotel.create({
          paket_day_id: newDay.id,
          id_hotel: h.id_hotel,
          id_tipe_kamar: h.id_tipe_kamar,
          season_type: h.season?.type,
          id_musim: h.season?.id_musim
        }, { transaction: t })),

        ...(data.akomodasi?.villas || []).map(v => PaketVilla.create({
          paket_day_id: newDay.id,
          id_villa: v.id_villa,
          id_tipe_kamar: v.id_tipe_kamar,
          season_type: v.season?.type,
          id_musim: v.season?.id_musim
        }, { transaction: t })),

        ...(data.akomodasi?.additional || []).map(a => PaketAdditionalAkomodasi.create({
          paket_day_id: newDay.id,
          id_additional: a.id_additional
        }, { transaction: t })),

        // TOURS (gabungan: destinasi, aktivitas, restoran)
        ...(data.tours || []).map(item => {
          if (item.id_destinasi) {
            return PaketDestinasi.create({
              paket_day_id: newDay.id,
              no: item.no,
              id_destinasi: item.id_destinasi,
              type_wisata: item.type_wisata
            }, { transaction: t });
          }

          if (item.id_activity) {
            return PaketAktivitas.create({
              paket_day_id: newDay.id,
              no: item.no,
              id_vendor: item.id_vendor,
              id_activity: item.id_activity,
              type_wisata: item.type_wisata
            }, { transaction: t });
          }

          if (item.id_resto) {
            return PaketRestoran.create({
              paket_day_id: newDay.id,
              no: item.no,
              id_resto: item.id_resto,
              id_menu: item.id_menu,
              type_wisata: item.type_wisata
            }, { transaction: t });
          }

          return Promise.resolve();
        }),

        // TRANSPORT
        ...(data.transport?.mobils || []).map(m => PaketTransportMobil.create({
          paket_day_id: newDay.id,
          id_mobil: m.id_mobil,
          keterangan: m.keterangan,
          id_area: m.id_area
        }, { transaction: t })),

        ...(data.transport?.additional || []).map(a => PaketTransportAdditional.create({
          paket_day_id: newDay.id,
          id_additional: a.id_additional
        }, { transaction: t }))
      ]);
    }

    await t.commit();
    formatResponse(res, 200, 'Full package updated successfully', { id: paket.id });

  } catch (err) {
    await t.rollback();
    formatResponse(res, 500, err.message, null);
  }
};

// DELETE FULL
const deleteFullPackage = async (req, res) => {
  const t = await Paket.sequelize.transaction();
  try {
    const { id } = req.params;

    const paket = await Paket.findByPk(id, {
      include: { model: PaketDay, as: 'days' },
      transaction: t
    });

    if (!paket) {
      await t.rollback();
      return formatResponse(res, 404, 'Package not found', null);
    }

    for (const day of paket.days || []) {
      await Promise.all([
        PaketHotel.destroy({ where: { paket_day_id: day.id }, transaction: t }),
        PaketVilla.destroy({ where: { paket_day_id: day.id }, transaction: t }),
        PaketAdditionalAkomodasi.destroy({ where: { paket_day_id: day.id }, transaction: t }),
        PaketDestinasi.destroy({ where: { paket_day_id: day.id }, transaction: t }),
        PaketAktivitas.destroy({ where: { paket_day_id: day.id }, transaction: t }),
        PaketRestoran.destroy({ where: { paket_day_id: day.id }, transaction: t }),
        PaketTransportMobil.destroy({ where: { paket_day_id: day.id }, transaction: t }),
        PaketTransportAdditional.destroy({ where: { paket_day_id: day.id }, transaction: t }),
        day.destroy({ transaction: t })
      ]);
    }

    await paket.destroy({ transaction: t });
    await t.commit();
    formatResponse(res, 200, 'Full package deleted successfully', null);
  } catch (err) {
    await t.rollback();
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  createPackage,
  getAllPackages,
  getPackageById,
  updatePackage,
  deletePackage,
  createFullPackage,
  getAllFullPackages,
  updateFullPackage,
  deleteFullPackage
};
