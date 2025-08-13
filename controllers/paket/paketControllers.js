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
const { Admin } = require('../../models/admin');

const { formatResponse } = require('../../utils/formatResponse');

const createPackage = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || !name.trim()) {
      return formatResponse(res, 400, 'Name is required', null);
    }

    const userId = req.user?.id; // dari middleware kamu
    if (!userId) {
      return formatResponse(res, 401, 'Unauthorized', null);
    }

    const newPaket = await Paket.create({
      name: name.trim(),
      description: description ?? null,
      created_by: userId,
      updated_by: userId
    });

    // optional: include creator agar response langsung lengkap
    const created = await Paket.findByPk(newPaket.id, {
      include: [
        { model: Admin, as: 'creator', attributes: ['id', 'username', 'name'] },
        { model: Admin, as: 'updater', attributes: ['id', 'username', 'name'] }
      ]
    });

    formatResponse(res, 201, 'Package created successfully', created);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// READ ALL
const getAllPackages = async (req, res) => {
  try {
    const packages = await Paket.findAll({
      order: [['createdAt', 'DESC']],
      include: [
        { model: Admin, as: 'creator', attributes: ['id', 'username', 'name'] },
        { model: Admin, as: 'updater', attributes: ['id', 'username', 'name'] }
      ]
    });

    formatResponse(res, 200, 'Packages retrieved successfully', packages);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// UPDATE
const updatePackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;

    const userId = req.user?.id;
    if (!userId) {
      return formatResponse(res, 401, 'Unauthorized', null);
    }

    const paket = await Paket.findByPk(id);
    if (!paket) return formatResponse(res, 404, 'Package not found', null);

    await paket.update({
      ...(name !== undefined ? { name: name.trim() } : {}),
      ...(description !== undefined ? { description } : {}),
      updated_by: userId
    });

    const updated = await Paket.findByPk(paket.id, {
      include: [
        { model: Admin, as: 'creator', attributes: ['id', 'username', 'name'] },
        { model: Admin, as: 'updater', attributes: ['id', 'username', 'name'] }
      ]
    });

    formatResponse(res, 200, 'Package updated successfully', updated);
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
// const createFullPackage = async (req, res) => {
//   const t = await Paket.sequelize.transaction();
//   try {
//     const { name, description, days } = req.body;
//     console.log(JSON.stringify(req.body));


//     if (!name || !Array.isArray(days) || days.length === 0) {
//       return formatResponse(res, 400, 'Package name and at least one day are required', null);
//     }

//     const newPaket = await Paket.create({ name, description }, { transaction: t });

//     for (const day of days) {
//       const newDay = await PaketDay.create({
//         paket_id: newPaket.id,
//         name: day.name,
//         description_day: day.description_day
//       }, { transaction: t });

//       const data = day.data || {};

//       await Promise.all([

//         // AKOMODASI
//         ...(data.akomodasi?.hotels || []).map(hotel => PaketHotel.create({
//           paket_day_id: newDay.id,
//           id_hotel: hotel.id_hotel,
//           id_tipe_kamar: hotel.id_tipe_kamar,
//           season_type: hotel.season?.type,
//           id_musim: hotel.season?.id_musim
//         }, { transaction: t })),

//         ...(data.akomodasi?.villas || []).map(villa => PaketVilla.create({
//           paket_day_id: newDay.id,
//           id_villa: villa.id_villa,
//           id_tipe_kamar: villa.id_tipe_kamar,
//           season_type: villa.season?.type,
//           id_musim: villa.season?.id_musim
//         }, { transaction: t })),

//         ...(data.akomodasi?.additional || []).map(add => PaketAdditionalAkomodasi.create({
//           paket_day_id: newDay.id,
//           id_additional: add.id_additional
//         }, { transaction: t })),

//         // TOURS — gabungan dari destinasi, aktivitas, restoran
//         ...(data.tours || []).map(item => {
//           if (item.id_destinasi) {
//             return PaketDestinasi.create({
//               paket_day_id: newDay.id,
//               no: item.no,
//               id_destinasi: item.id_destinasi,
//               type_wisata: item.type_wisata
//             }, { transaction: t });
//           }

//           if (item.id_activity) {
//             return PaketAktivitas.create({
//               paket_day_id: newDay.id,
//               no: item.no,
//               id_vendor: item.id_vendor,
//               id_activity: item.id_activity,
//               type_wisata: item.type_wisata
//             }, { transaction: t });
//           }

//           if (item.id_resto) {
//             return PaketRestoran.create({
//               paket_day_id: newDay.id,
//               no: item.no,
//               id_resto: item.id_resto,
//               id_menu: item.id_menu,
//               type_wisata: item.type_wisata
//             }, { transaction: t });
//           }

//           return Promise.resolve(); // Ignore if no known type
//         }),

//         // TRANSPORT
//         ...(data.transport?.mobils || []).map(mobil => PaketTransportMobil.create({
//           paket_day_id: newDay.id,
//           id_mobil: mobil.id_mobil,
//           keterangan: mobil.keterangan,
//           id_area: mobil.id_area
//         }, { transaction: t })),

//         ...(data.transport?.additional || []).map(add => PaketTransportAdditional.create({
//           paket_day_id: newDay.id,
//           id_additional: add.id_additional
//         }, { transaction: t }))
//       ]);
//     }

//     await t.commit();
//     formatResponse(res, 201, 'Full package created successfully', { id: newPaket.id });

//   } catch (err) {
//     await t.rollback();
//     formatResponse(res, 500, err.message, null);
//   }
// };
// CREATE FULL
const createFullPackage = async (req, res) => {
  const { name, description, days } = req.body;

  // Validasi awal (sebelum buka transaksi)
  if (!name || !Array.isArray(days) || days.length === 0) {
    return formatResponse(res, 400, 'Package name and at least one day are required', null);
  }

  const userId = req.user?.id;
  if (!userId) {
    return formatResponse(res, 401, 'Unauthorized', null);
  }

  const t = await Paket.sequelize.transaction();
  try {
    // audit fields (kalau child juga perlu, tinggal dipakai di bawah)
    const auditFields = { created_by: userId, updated_by: userId };

    // 1) Buat Paket dengan audit fields
    const newPaket = await Paket.create(
      { name: name.trim(), description: description ?? null, ...auditFields },
      { transaction: t }
    );

    // 2) Loop tiap day
    for (const day of days) {
      const newDay = await PaketDay.create(
        {
          paket_id: newPaket.id,
          name: day.name,
          description_day: day.description_day
          // ...auditFields  // ← aktifkan jika PaketDay juga punya created_by/updated_by
        },
        { transaction: t }
      );

      const data = day.data || {};

      // 3) Buat child records paralel per day
      await Promise.all([
        // AKOMODASI - HOTELS
        ...(data.akomodasi?.hotels || []).map(hotel =>
          PaketHotel.create(
            {
              paket_day_id: newDay.id,
              id_hotel: hotel.id_hotel,
              id_tipe_kamar: hotel.id_tipe_kamar,
              season_type: hotel.season?.type,
              id_musim: hotel.season?.id_musim
              // ...auditFields
            },
            { transaction: t }
          )
        ),

        // AKOMODASI - VILLAS
        ...(data.akomodasi?.villas || []).map(villa =>
          PaketVilla.create(
            {
              paket_day_id: newDay.id,
              id_villa: villa.id_villa,
              id_tipe_kamar: villa.id_tipe_kamar,
              season_type: villa.season?.type,
              id_musim: villa.season?.id_musim
              // ...auditFields
            },
            { transaction: t }
          )
        ),

        // AKOMODASI - ADDITIONAL
        ...(data.akomodasi?.additional || []).map(add =>
          PaketAdditionalAkomodasi.create(
            {
              paket_day_id: newDay.id,
              id_additional: add.id_additional
              // ...auditFields
            },
            { transaction: t }
          )
        ),

        // TOURS (destinasi / aktivitas / restoran)
        ...(data.tours || []).map(item => {
          if (item.id_destinasi) {
            return PaketDestinasi.create(
              {
                paket_day_id: newDay.id,
                no: item.no,
                id_destinasi: item.id_destinasi,
                type_wisata: item.type_wisata
                // ...auditFields
              },
              { transaction: t }
            );
          }
          if (item.id_activity) {
            return PaketAktivitas.create(
              {
                paket_day_id: newDay.id,
                no: item.no,
                id_vendor: item.id_vendor,
                id_activity: item.id_activity,
                type_wisata: item.type_wisata
                // ...auditFields
              },
              { transaction: t }
            );
          }
          if (item.id_resto) {
            return PaketRestoran.create(
              {
                paket_day_id: newDay.id,
                no: item.no,
                id_resto: item.id_resto,
                id_menu: item.id_menu,
                type_wisata: item.type_wisata
                // ...auditFields
              },
              { transaction: t }
            );
          }
          return Promise.resolve(); // skip jika tidak match tipe
        }),

        // TRANSPORT - MOBIL
        ...(data.transport?.mobils || []).map(mobil =>
          PaketTransportMobil.create(
            {
              paket_day_id: newDay.id,
              id_mobil: mobil.id_mobil,
              keterangan: mobil.keterangan,
              id_area: mobil.id_area
              // ...auditFields
            },
            { transaction: t }
          )
        ),

        // TRANSPORT - ADDITIONAL
        ...(data.transport?.additional || []).map(add =>
          PaketTransportAdditional.create(
            {
              paket_day_id: newDay.id,
              id_additional: add.id_additional
              // ...auditFields
            },
            { transaction: t }
          )
        )
      ]);
    }

    await t.commit();
    return formatResponse(res, 201, 'Full package created successfully', { id: newPaket.id });
  } catch (err) {
    await t.rollback();
    return formatResponse(res, 500, err.message, null);
  }
};

// GET ALL FULL
// const getAllFullPackages = async (req, res) => {
//   try {
//     const packages = await Paket.findAll({
//       include: {
//         model: PaketDay,
//         as: 'days',
//         include: [
//           { model: PaketHotel, as: 'hotels' },
//           { model: PaketVilla, as: 'villas' },
//           { model: PaketAdditionalAkomodasi, as: 'akomodasi_additionals' },
//           { model: PaketDestinasi, as: 'destinations' },
//           { model: PaketAktivitas, as: 'activities' },
//           { model: PaketRestoran, as: 'restaurants' },
//           { model: PaketTransportMobil, as: 'mobils' },
//           { model: PaketTransportAdditional, as: 'transport_additionals' }
//         ]
//       }
//     });

//     // Format ulang hasilnya agar sesuai struktur JSON input
//     const formattedPackages = packages.map(pkg => ({
//       id: pkg.id,
//       name: pkg.name,
//       description: pkg.description,
//       days: pkg.days.map(day => {
//         const tours = [
//           ...(day.destinations || []).map(dest => ({
//             no: dest.no,
//             id_destinasi: dest.id_destinasi,
//             type_wisata: dest.type_wisata
//           })),
//           ...(day.activities || []).map(act => ({
//             no: act.no,
//             id_vendor: act.id_vendor,
//             id_activity: act.id_activity,
//             type_wisata: act.type_wisata
//           })),
//           ...(day.restaurants || []).map(resto => ({
//             no: resto.no,
//             id_resto: resto.id_resto,
//             id_menu: resto.id_menu,
//             type_wisata: resto.type_wisata
//           }))
//         ];

//         return {
//           id: day.id,
//           name: day.name,
//           description_day: day.description_day,
//           data: {
//             akomodasi: {
//               hotels: day.hotels || [],
//               villas: day.villas || [],
//               additional: day.akomodasi_additionals || []
//             },
//             tours,
//             transport: {
//               mobils: day.mobils || [],
//               additional: day.transport_additionals || []
//             }
//           }
//         };
//       })
//     }));

//     formatResponse(res, 200, 'Full packages retrieved successfully', formattedPackages);
//   } catch (err) {
//     formatResponse(res, 500, err.message, null);
//   }
// };
// GET ALL FULL
const getAllFullPackages = async (req, res) => {
  try {
    const packages = await Paket.findAll({
      attributes: ['id', 'name', 'description', 'created_by', 'updated_by', 'createdAt', 'updatedAt'],
      include: [
        // siapa yang buat & update
        { model: Admin, as: 'creator', attributes: ['id', 'username', 'name'] },
        { model: Admin, as: 'updater', attributes: ['id', 'username', 'name'] },

        // days + anak-anaknya
        {
          model: PaketDay,
          as: 'days',
          separate: true,                // biar order days tidak duplikasi row paket
          order: [['id', 'ASC']],        // atau [['createdAt','ASC']]
          include: [
            { model: PaketHotel, as: 'hotels' },
            { model: PaketVilla, as: 'villas' },
            { model: PaketAdditionalAkomodasi, as: 'akomodasi_additionals' },

            // tours dipecah: destinasi, aktivitas, restoran
            { model: PaketDestinasi, as: 'destinations', separate: true, order: [['no', 'ASC']] },
            { model: PaketAktivitas, as: 'activities', separate: true, order: [['no', 'ASC']] },
            { model: PaketRestoran, as: 'restaurants', separate: true, order: [['no', 'ASC']] },

            // transport
            { model: PaketTransportMobil, as: 'mobils' },
            { model: PaketTransportAdditional, as: 'transport_additionals' }
          ]
        }
      ],
      order: [['createdAt', 'DESC']]
    });

    const formattedPackages = packages.map(pkg => ({
      id: pkg.id,
      name: pkg.name,
      description: pkg.description,

      // info audit – kalau kamu perlu tampilkan
      created_by: pkg.created_by,
      updated_by: pkg.updated_by,
      creator: pkg.creator ? {
        id: pkg.creator.id, username: pkg.creator.username, name: pkg.creator.name
      } : null,
      updater: pkg.updater ? {
        id: pkg.updater.id, username: pkg.updater.username, name: pkg.updater.name
      } : null,
      createdAt: pkg.createdAt,
      updatedAt: pkg.updatedAt,

      days: (pkg.days || []).map(day => {
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
        ].sort((a, b) => (a.no ?? 0) - (b.no ?? 0)); // jaga-jaga kalau ada yang null

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

// // UPDATE FULL
// const updateFullPackage = async (req, res) => {
//   const t = await Paket.sequelize.transaction();
//   try {
//     const { id } = req.params;
//     const { name, description, days } = req.body;
//     console.log(id);
//     console.log(JSON.stringify(req.body)); // Log the req.body);

//     if (!name || !Array.isArray(days)) {
//       await t.rollback();
//       return formatResponse(res, 400, 'Package name and days are required', null);
//     }

//     const paket = await Paket.findByPk(id, {
//       include: { model: PaketDay, as: 'days' },
//       transaction: t
//     });

//     if (!paket) {
//       await t.rollback();
//       return formatResponse(res, 404, 'Package not found', null);
//     }

//     // Update header paket
//     await paket.update({ name, description }, { transaction: t });

//     // Hapus semua relasi dari hari-hari lama
//     if (paket.days && paket.days.length > 0) {
//       for (const day of paket.days) {
//         await Promise.all([
//           PaketHotel.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//           PaketVilla.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//           PaketAdditionalAkomodasi.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//           PaketDestinasi.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//           PaketAktivitas.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//           PaketRestoran.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//           PaketTransportMobil.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//           PaketTransportAdditional.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//           day.destroy({ transaction: t })
//         ]);
//       }
//     }

//     // Buat ulang hari-hari baru
//     for (const day of days) {
//       const newDay = await PaketDay.create({
//         paket_id: paket.id,
//         name: day.name,
//         description_day: day.description_day
//       }, { transaction: t });

//       const data = day.data || {};

//       await Promise.all([

//         // AKOMODASI
//         ...(data.akomodasi?.hotels || []).map(h => PaketHotel.create({
//           paket_day_id: newDay.id,
//           id_hotel: h.id_hotel,
//           id_tipe_kamar: h.id_tipe_kamar,
//           season_type: h.season?.type,
//           id_musim: h.season?.id_musim
//         }, { transaction: t })),

//         ...(data.akomodasi?.villas || []).map(v => PaketVilla.create({
//           paket_day_id: newDay.id,
//           id_villa: v.id_villa,
//           id_tipe_kamar: v.id_tipe_kamar,
//           season_type: v.season?.type,
//           id_musim: v.season?.id_musim
//         }, { transaction: t })),

//         ...(data.akomodasi?.additional || []).map(a => PaketAdditionalAkomodasi.create({
//           paket_day_id: newDay.id,
//           id_additional: a.id_additional
//         }, { transaction: t })),

//         // TOURS (gabungan: destinasi, aktivitas, restoran)
//         ...(data.tours || []).map(item => {
//           if (item.id_destinasi) {
//             return PaketDestinasi.create({
//               paket_day_id: newDay.id,
//               no: item.no,
//               id_destinasi: item.id_destinasi,
//               type_wisata: item.type_wisata
//             }, { transaction: t });
//           }

//           if (item.id_activity) {
//             return PaketAktivitas.create({
//               paket_day_id: newDay.id,
//               no: item.no,
//               id_vendor: item.id_vendor,
//               id_activity: item.id_activity,
//               type_wisata: item.type_wisata
//             }, { transaction: t });
//           }

//           if (item.id_resto) {
//             return PaketRestoran.create({
//               paket_day_id: newDay.id,
//               no: item.no,
//               id_resto: item.id_resto,
//               id_menu: item.id_menu,
//               type_wisata: item.type_wisata
//             }, { transaction: t });
//           }

//           return Promise.resolve();
//         }),

//         // TRANSPORT
//         ...(data.transport?.mobils || []).map(m => PaketTransportMobil.create({
//           paket_day_id: newDay.id,
//           id_mobil: m.id_mobil,
//           keterangan: m.keterangan,
//           id_area: m.id_area
//         }, { transaction: t })),

//         ...(data.transport?.additional || []).map(a => PaketTransportAdditional.create({
//           paket_day_id: newDay.id,
//           id_additional: a.id_additional
//         }, { transaction: t }))
//       ]);
//     }

//     await t.commit();
//     formatResponse(res, 200, 'Full package updated successfully', { id: paket.id });

//   } catch (err) {
//     await t.rollback();
//     formatResponse(res, 500, err.message, null);
//   }
// };
// UPDATE FULL (with admin audit)
const updateFullPackage = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, days } = req.body;

    // Validasi awal
    if (!name || !Array.isArray(days)) {
      return formatResponse(res, 400, 'Package name and days are required', null);
    }

    const userId = req.user?.id;
    if (!userId) {
      return formatResponse(res, 401, 'Unauthorized', null);
    }

    // Cek dulu paket-nya (tanpa transaksi dulu)
    const paket = await Paket.findByPk(id, {
      include: { model: PaketDay, as: 'days' }
    });

    if (!paket) {
      return formatResponse(res, 404, 'Package not found', null);
    }

    // Mulai transaksi setelah semua valid
    // const t = await Paket.sequelize.transaction();
    // try {
    //   // 1) Update header paket + updated_by
    //   await paket.update(
    //     { name: name.trim(), description: description ?? null, updated_by: userId },
    //     { transaction: t }
    //   );
    // Mulai transaksi setelah semua valid
    const t = await Paket.sequelize.transaction();
    try {
      // 1) Update header paket + audit (backfill created_by jika null)
      const updateHeader = {
        name: name.trim(),
        description: description ?? null,
        updated_by: userId
      };
      if (paket.created_by == null) {
        updateHeader.created_by = userId;
      }
      await paket.update(updateHeader, { transaction: t });

      // 2) Hapus semua relasi lama (anak-2)
      if (Array.isArray(paket.days) && paket.days.length > 0) {
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

      // (opsional) siapkan audit fields untuk child bila tabel mereka juga punya kolom created_by/updated_by
      const audit = { created_by: userId, updated_by: userId };

      // 3) Buat ulang struktur days + children
      for (const day of days) {
        const newDay = await PaketDay.create(
          {
            paket_id: paket.id,
            name: day.name,
            description_day: day.description_day
            // ...audit   // ← aktifkan jika PaketDay juga punya audit fields
          },
          { transaction: t }
        );

        const data = day.data || {};

        await Promise.all([
          // AKOMODASI - HOTELS
          ...(data.akomodasi?.hotels || []).map(h =>
            PaketHotel.create(
              {
                paket_day_id: newDay.id,
                id_hotel: h.id_hotel,
                id_tipe_kamar: h.id_tipe_kamar,
                season_type: h.season?.type,
                id_musim: h.season?.id_musim
                // ...audit
              },
              { transaction: t }
            )
          ),

          // AKOMODASI - VILLAS
          ...(data.akomodasi?.villas || []).map(v =>
            PaketVilla.create(
              {
                paket_day_id: newDay.id,
                id_villa: v.id_villa,
                id_tipe_kamar: v.id_tipe_kamar,
                season_type: v.season?.type,
                id_musim: v.season?.id_musim
                // ...audit
              },
              { transaction: t }
            )
          ),

          // AKOMODASI - ADDITIONAL
          ...(data.akomodasi?.additional || []).map(a =>
            PaketAdditionalAkomodasi.create(
              {
                paket_day_id: newDay.id,
                id_additional: a.id_additional
                // ...audit
              },
              { transaction: t }
            )
          ),

          // TOURS (destinasi / aktivitas / restoran)
          ...(data.tours || []).map(item => {
            if (item.id_destinasi) {
              return PaketDestinasi.create(
                {
                  paket_day_id: newDay.id,
                  no: item.no,
                  id_destinasi: item.id_destinasi,
                  type_wisata: item.type_wisata
                  // ...audit
                },
                { transaction: t }
              );
            }
            if (item.id_activity) {
              return PaketAktivitas.create(
                {
                  paket_day_id: newDay.id,
                  no: item.no,
                  id_vendor: item.id_vendor,
                  id_activity: item.id_activity,
                  type_wisata: item.type_wisata
                  // ...audit
                },
                { transaction: t }
              );
            }
            if (item.id_resto) {
              return PaketRestoran.create(
                {
                  paket_day_id: newDay.id,
                  no: item.no,
                  id_resto: item.id_resto,
                  id_menu: item.id_menu,
                  type_wisata: item.type_wisata
                  // ...audit
                },
                { transaction: t }
              );
            }
            return Promise.resolve();
          }),

          // TRANSPORT - MOBIL
          ...(data.transport?.mobils || []).map(m =>
            PaketTransportMobil.create(
              {
                paket_day_id: newDay.id,
                id_mobil: m.id_mobil,
                keterangan: m.keterangan,
                id_area: m.id_area
                // ...audit
              },
              { transaction: t }
            )
          ),

          // TRANSPORT - ADDITIONAL
          ...(data.transport?.additional || []).map(a =>
            PaketTransportAdditional.create(
              {
                paket_day_id: newDay.id,
                id_additional: a.id_additional
                // ...audit
              },
              { transaction: t }
            )
          )
        ]);
      }

      await t.commit();
      return formatResponse(res, 200, 'Full package updated successfully', { id: paket.id });
    } catch (err) {
      await t.rollback();
      return formatResponse(res, 500, err.message, null);
    }
  } catch (err) {
    return formatResponse(res, 500, err.message, null);
  }
};

// // DELETE FULL
// const deleteFullPackage = async (req, res) => {
//   const t = await Paket.sequelize.transaction();
//   try {
//     const { id } = req.params;

//     const paket = await Paket.findByPk(id, {
//       include: { model: PaketDay, as: 'days' },
//       transaction: t
//     });

//     if (!paket) {
//       await t.rollback();
//       return formatResponse(res, 404, 'Package not found', null);
//     }

//     for (const day of paket.days || []) {
//       await Promise.all([
//         PaketHotel.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//         PaketVilla.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//         PaketAdditionalAkomodasi.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//         PaketDestinasi.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//         PaketAktivitas.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//         PaketRestoran.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//         PaketTransportMobil.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//         PaketTransportAdditional.destroy({ where: { paket_day_id: day.id }, transaction: t }),
//         day.destroy({ transaction: t })
//       ]);
//     }

//     await paket.destroy({ transaction: t });
//     await t.commit();
//     formatResponse(res, 200, 'Full package deleted successfully', null);
//   } catch (err) {
//     await t.rollback();
//     formatResponse(res, 500, err.message, null);
//   }
// };

// DELETE FULL (with admin check)
const deleteFullPackage = async (req, res) => {
  try {
    const { id } = req.params;

    // pastikan user ada
    if (!req.user?.id) {
      return formatResponse(res, 401, 'Unauthorized', null);
    }

    // ambil paket dulu (tanpa transaksi)
    const paket = await Paket.findByPk(id, {
      attributes: ['id', 'created_by'],
      include: { model: PaketDay, as: 'days', attributes: ['id'] }
    });

    if (!paket) {
      return formatResponse(res, 404, 'Package not found', null);
    }

    // otorisasi: super_admin bebas; admin hanya jika pemilik
    const isSuper = req.user.role === 'super_admin';
    const isOwner = paket.created_by === req.user.id;
    if (!isSuper && !isOwner) {
      return formatResponse(res, 403, 'Forbidden: you cannot delete this package', null);
    }

    // mulai transaksi setelah valid
    const t = await Paket.sequelize.transaction();
    try {
      // --- Jika kamu sudah set onDelete: 'CASCADE' di semua relasi,
      // kamu bisa cukup:
      // await paket.destroy({ transaction: t });

      // Hapus manual (sesuai kodenya sekarang)
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
          PaketDay.destroy({ where: { id: day.id }, transaction: t })
        ]);
      }

      await paket.destroy({ transaction: t });
      await t.commit();
      return formatResponse(res, 200, 'Full package deleted successfully', null);
    } catch (err) {
      await t.rollback();
      return formatResponse(res, 500, err.message, null);
    }
  } catch (err) {
    return formatResponse(res, 500, err.message, null);
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
