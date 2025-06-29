const { additionalInfo } = require('../../models/transport/index');
const { formatResponse } = require('../../utils/formatResponse');

const createAdditional = async (req, res) => {
    try {
        const { name } = req.body;
        const newAdditional = await additionalInfo.create({ name });
        formatResponse(res, 201, 'Additional created successfully', newAdditional);
    } catch (err) {
        formatResponse(res, 500, err.message, null);
    }
};

const updateAdditional = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const additional = await additionalInfo.findByPk(id);
        if (!additional) return formatResponse(res, 404, 'Additional not found', null);
        await additional.update({ name });
        formatResponse(res, 200, 'Additional updated successfully', additional);
    } catch (err) {
        formatResponse(res, 500, err.message, null);
    }
};

const deleteAdditional = async (req, res) => {
    try {
        const { id } = req.params;
        const additional = await additionalInfo.findByPk(id);
        if (!additional) return formatResponse(res, 404, 'Additional not found', null);
        await additional.destroy();
        formatResponse(res, 200, 'Additional deleted successfully', null);
    } catch (err) {
        formatResponse(res, 500, err.message, null);
    }
};

const getAdditionalById = async (req, res) => {
    try {
        const { id } = req.params;
        const additional = await additionalInfo.findByPk(id);
        if (!additional) return formatResponse(res, 404, 'Additional not found', null);
        formatResponse(res, 200, 'Additional found', additional);
    } catch (err) {
        formatResponse(res, 500, err.message, null);
    }
};

const getAllAdditional = async (req, res) => {
    try {
        const additional = await additionalInfo.findAll();
        formatResponse(res, 200, 'Additional found', additional);
    } catch (err) {
        formatResponse(res, 500, err.message, null);
    }
};

module.exports = { createAdditional, updateAdditional, deleteAdditional, getAdditionalById, getAllAdditional };