const { pesanan: Pesanan } = require('../../models/pesanan');
const { formatResponse } = require('../../utils/formatResponse');
const { Admin } = require('../../models/admin');
const {
  Paket,
  PaketDay,
  PaketHotel,
  PaketVilla,
  PaketAdditionalAkomodasi,
  PaketDestinasi,
  PaketAktivitas,
  PaketRestoran,
  PaketTransportMobil,
  PaketTransportAdditional } = require('../../models/paket');
const path = require('path');
const fs = require('fs').promises;

// CREATE PESANAN
const createPesanan = async (req, res) => {
  try {
    // ✅ Ambil ID admin dari JWT token
    const id_admin = req.user?.id;
    if (!id_admin) {
      return formatResponse(res, 403, 'Unauthorized: admin ID not found in token', null);
    }
    const { kode_pesanan } = req.body;
    const invoiceFile = req.files?.invoice?.[0];
    const itineraryFile = req.files?.itinerary?.[0];

    if (!invoiceFile || !itineraryFile) {
      return formatResponse(res, 400, 'Both invoice and itinerary PDFs are required', null);
    }

    const pesanan = await Pesanan.create({
      kode_pesanan,
      invoice_pdf: invoiceFile.filename,
      itinerary_pdf: itineraryFile.filename,
      id_admin,
      id_paket: req.body.id_paket
    });

    formatResponse(res, 201, 'Pesanan created', pesanan);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// GET ALL PESANAN (With full link)
// const getAllPesanan = async (req, res) => {
//   try {
//     const baseUrl = `${req.protocol}://${req.get('host')}/pdf`;

//     // Ambil query sort dari request, default: 'DESC'
//     const sortOrder = req.query.sort?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

//     const list = await Pesanan.findAll({
//       order: [['createdAt', sortOrder]],
//       include: [
//         {
//           model: Admin,
//           as: 'admin',
//           attributes: ['id', 'name']
//         }
//       ]
//     });

//     const result = list.map(p => ({
//       id: p.id,
//       kode_pesanan: p.kode_pesanan,
//       invoice_pdf: `${baseUrl}/invoice/${p.invoice_pdf}`,
//       itinerary_pdf: `${baseUrl}/itinerary/${p.itinerary_pdf}`,
//       createdAt: p.createdAt,
//       updatedAt: p.updatedAt,
//       admin: {
//         id: p.admin?.id || null,
//         name: p.admin?.name || null
//       }
//     }));

//     formatResponse(res, 200, 'List pesanan', result);
//   } catch (err) {
//     formatResponse(res, 500, err.message, null);
//   }
// };

const getAllPesanan = async (req, res) => {
  try {
    const baseUrl = `${req.protocol}://${req.get('host')}/pdf`;
    const sortOrder = req.query.sort?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

    const list = await Pesanan.findAll({
      order: [['createdAt', sortOrder]],
      include: [
        // admin pemilik pesanan
        { model: Admin, as: 'admin', attributes: ['id', 'name'] },

        // paket yang direferensikan oleh pesanan (boleh null)
        {
          model: Paket,
          as: 'paket',
          attributes: ['id', 'name', 'description', 'created_by', 'updated_by', 'createdAt', 'updatedAt'],
          include: [
            // siapa yang buat & update paket
            { model: Admin, as: 'creator', attributes: ['id', 'username', 'name'] },
            { model: Admin, as: 'updater', attributes: ['id', 'username', 'name'] },

            // days dan seluruh anaknya
            {
              model: PaketDay,
              as: 'days',
              separate: true,           // hindari duplikasi row paket
              order: [['id', 'ASC']],
              include: [
                { model: PaketHotel, as: 'hotels' },
                { model: PaketVilla, as: 'villas' },
                { model: PaketAdditionalAkomodasi, as: 'akomodasi_additionals' },

                // tours dipecah
                { model: PaketDestinasi, as: 'destinations', separate: true, order: [['no', 'ASC']] },
                { model: PaketAktivitas, as: 'activities', separate: true, order: [['no', 'ASC']] },
                { model: PaketRestoran, as: 'restaurants', separate: true, order: [['no', 'ASC']] },

                // transport
                { model: PaketTransportMobil, as: 'mobils' },
                { model: PaketTransportAdditional, as: 'transport_additionals' }
              ]
            }
          ]
        }
      ]
    });

    const result = list.map(p => {
      // format paket (object atau null)
      const pkg = p.paket;
      const formattedPackage = pkg ? {
        id: pkg.id,
        name: pkg.name,
        description: pkg.description,

        created_by: pkg.created_by,
        updated_by: pkg.updated_by,
        creator: pkg.creator ? {
          id: pkg.creator.id,
          username: pkg.creator.username,
          name: pkg.creator.name
        } : null,
        updater: pkg.updater ? {
          id: pkg.updater.id,
          username: pkg.updater.username,
          name: pkg.updater.name
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
          ].sort((a, b) => (a.no ?? 0) - (b.no ?? 0));

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
      } : null;

      return {
        id: p.id,
        kode_pesanan: p.kode_pesanan,
        invoice_pdf: `${baseUrl}/invoice/${p.invoice_pdf}`,
        itinerary_pdf: `${baseUrl}/itinerary/${p.itinerary_pdf}`,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt,
        admin: p.admin ? {
          id: p.admin.id,
          name: p.admin.name
        } : null,
        paket: formattedPackage
      };
    });

    return formatResponse(res, 200, 'List pesanan', result);
  } catch (err) {
    return formatResponse(res, 500, err.message, null);
  }
};

// DELETE PESANAN (hapus record + file PDF)
const deletePesanan = async (req, res) => {
  const { id } = req.params; // asumsi: /pesanan/:id
  try {
    const data = await Pesanan.findByPk(id);

    if (!data) {
      return formatResponse(res, 404, 'Pesanan not found', null);
    }

    // Base dir ke folder public/pdf
    // (Jika struktur proyekmu beda, sesuaikan relatif path-nya)
    const basePdfDir = path.resolve(__dirname, '../../public/pdf');

    const targets = [
      { folder: 'invoice', filename: data.invoice_pdf },
      { folder: 'itinerary', filename: data.itinerary_pdf }
    ]
      .filter(f => !!f.filename)
      .map(f => path.join(basePdfDir, f.folder, f.filename));

    // Hapus file—abaikan kalau tidak ada (ENOENT)
    await Promise.all(
      targets.map(async filePath => {
        try {
          await fs.unlink(filePath);
        } catch (err) {
          if (err.code !== 'ENOENT') throw err; // kalau selain "file tidak ada", lempar error
        }
      })
    );

    // Hapus record di DB
    await data.destroy();

    return formatResponse(res, 200, 'Pesanan deleted', { id });
  } catch (err) {
    return formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  createPesanan,
  getAllPesanan,
  deletePesanan
};
