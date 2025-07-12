const { pesanan: Pesanan } = require('../../models/pesanan');
const { formatResponse } = require('../../utils/formatResponse');
const { v4: uuidv4 } = require('uuid');
const { Admin } = require('../../models/admin');

// CREATE PESANAN
const createPesanan = async (req, res) => {
    try {
        // ✅ Ambil ID admin dari JWT token
        const id_admin = req.user?.id;
        if (!id_admin) {
            return formatResponse(res, 403, 'Unauthorized: admin ID not found in token', null);
        }

        const kode_pesanan = 'ORD-' + uuidv4().split('-')[0].toUpperCase();

        const invoiceFile = req.files?.invoice?.[0];
        const itineraryFile = req.files?.itinerary?.[0];

        if (!invoiceFile || !itineraryFile) {
            return formatResponse(res, 400, 'Both invoice and itinerary PDFs are required', null);
        }

        const pesanan = await Pesanan.create({
            kode_pesanan,
            invoice_pdf: invoiceFile.filename,
            itinerary_pdf: itineraryFile.filename,
            id_admin
        });

        formatResponse(res, 201, 'Pesanan created', pesanan);
    } catch (err) {
        formatResponse(res, 500, err.message, null);
    }
};

// GET ALL PESANAN (With full link)
const getAllPesanan = async (req, res) => {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}/pdf`;

        // Ambil query sort dari request, default: 'DESC'
        const sortOrder = req.query.sort?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';

        const list = await Pesanan.findAll({
            order: [['createdAt', sortOrder]],
            include: [
                {
                    model: Admin,
                    as: 'admin',
                    attributes: ['id', 'name']
                }
            ]
        });

        const result = list.map(p => ({
            id: p.id,
            kode_pesanan: p.kode_pesanan,
            invoice_pdf: `${baseUrl}/invoice/${p.invoice_pdf}`,
            itinerary_pdf: `${baseUrl}/itinerary/${p.itinerary_pdf}`,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt,
            admin: {
                id: p.admin?.id || null,
                name: p.admin?.name || null
            }
        }));

        formatResponse(res, 200, 'List pesanan', result);
    } catch (err) {
        formatResponse(res, 500, err.message, null);
    }
};


module.exports = {
    createPesanan,
    getAllPesanan
};
