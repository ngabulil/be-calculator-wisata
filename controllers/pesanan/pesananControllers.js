const { pesanan: Pesanan } = require('../../models/pesanan');
const { formatResponse } = require('../../utils/formatResponse');
const { v4: uuidv4 } = require('uuid');

// CREATE PESANAN
const createPesanan = async (req, res) => {
    try {
        const kode_pesanan = 'ORD-' + uuidv4().split('-')[0].toUpperCase();

        const invoiceFile = req.files?.invoice?.[0];
        const itineraryFile = req.files?.itinerary?.[0];

        if (!invoiceFile || !itineraryFile) {
            return formatResponse(res, 400, 'Both invoice and itinerary PDFs are required', null);
        }

        const pesanan = await Pesanan.create({
            kode_pesanan,
            invoice_pdf: invoiceFile.filename,
            itinerary_pdf: itineraryFile.filename
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

        const list = await Pesanan.findAll({ order: [['createdAt', 'DESC']] });

        const result = list.map(p => ({
            id: p.id,
            kode_pesanan: p.kode_pesanan,
            invoice_pdf: `${baseUrl}/invoice/${p.invoice_pdf}`,
            itinerary_pdf: `${baseUrl}/itinerary/${p.itinerary_pdf}`,
            createdAt: p.createdAt,
            updatedAt: p.updatedAt
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
