const { Mobil, Fullday, Halfday, Inout, Menginap } = require('../../models/mobil/index');
const { formatResponse } = require('../../utils/formatResponse');

const getAllMobilFull = async (req, res) => {
    try {
        const data = await Mobil.findAll({
            include: [
                { model: Fullday, as: 'fullday', attributes: ['id', 'area_name', 'price'] },
                { model: Halfday, as: 'halfday', attributes: ['id', 'area_name', 'price'] },
                { model: Inout, as: 'inout', attributes: ['id', 'area_name', 'price'] },
                { model: Menginap, as: 'menginap', attributes: ['id', 'area_name', 'price'] },
            ],
            order: [['id', 'ASC']],
        });

        const result = data.map((mobil) => ({
            id: mobil.id,
            jenisKendaraan: mobil.name,
            vendor: mobil.vendor,
            vendor_link: mobil.vendor_link,
            keterangan: {
                fullDay: mobil.fullday.map((item) => ({
                    id_area: item.id,  // gunakan id sebagai id_area
                    area: item.area_name,
                    price: item.price,
                })),
                halfDay: mobil.halfday.map((item) => ({
                    id_area: item.id,
                    area: item.area_name,
                    price: item.price,
                })),
                inOut: mobil.inout.map((item) => ({
                    id_area: item.id,
                    area: item.area_name,
                    price: item.price,
                })),
                menginap: mobil.menginap.map((item) => ({
                    id_area: item.id,
                    area: item.area_name,
                    price: item.price,
                })),
            },
        }));

        formatResponse(res, 200, 'List full kendaraan dan harga', result);
    } catch (error) {
        formatResponse(res, 500, error.message, null);
    }
};


const createFullMobil = async (req, res) => {
    const t = await Mobil.sequelize.transaction();
    try {
        const { name, vendor, vendor_link, keterangan } = req.body;

        if (!keterangan) {
            return formatResponse(res, 400, 'Keterangan tidak boleh kosong', null);
        }

        const { fullDay, halfDay, inOut, menginap } = keterangan;

        // 1. Buat Mobil
        const mobil = await Mobil.create({ name, vendor, vendor_link }, { transaction: t });

        // 2. Fullday
        if (Array.isArray(fullDay)) {
            const fulldayData = fullDay.map((item) => ({
                id_mobil: mobil.id,
                area_name: item.area,
                price: item.price,
            }));
            await Fullday.bulkCreate(fulldayData, { transaction: t });
        }

        // 3. Halfday
        if (Array.isArray(halfDay)) {
            const halfdayData = halfDay.map((item) => ({
                id_mobil: mobil.id,
                area_name: item.area,
                price: item.price,
            }));
            await Halfday.bulkCreate(halfdayData, { transaction: t });
        }

        // 4. InOut
        if (Array.isArray(inOut)) {
            const inoutData = inOut.map((item) => ({
                id_mobil: mobil.id,
                area_name: item.area,
                price: item.price,
            }));
            await Inout.bulkCreate(inoutData, { transaction: t });
        }

        // 5. Menginap
        if (Array.isArray(menginap)) {
            const menginapData = menginap.map((item) => ({
                id_mobil: mobil.id,
                area_name: item.area,
                price: item.price,
            }));
            await Menginap.bulkCreate(menginapData, { transaction: t });
        }

        await t.commit();
        formatResponse(res, 201, 'Mobil dan seluruh harga berhasil dibuat', { id: mobil.id });
    } catch (error) {
        await t.rollback();
        formatResponse(res, 500, error.message, null);
    }
};

const deleteFullMobil = async (req, res) => {
    const t = await Mobil.sequelize.transaction();
    try {
        const { id } = req.params;

        const mobil = await Mobil.findByPk(id);
        if (!mobil) return formatResponse(res, 404, 'Mobil not found', null);

        // Hapus semua data turunan terlebih dahulu
        await Fullday.destroy({ where: { id_mobil: id }, transaction: t });
        await Halfday.destroy({ where: { id_mobil: id }, transaction: t });
        await Inout.destroy({ where: { id_mobil: id }, transaction: t });
        await Menginap.destroy({ where: { id_mobil: id }, transaction: t });

        // Hapus mobil-nya
        await mobil.destroy({ transaction: t });

        await t.commit();
        formatResponse(res, 200, 'Mobil dan seluruh harga berhasil dihapus', null);
    } catch (error) {
        await t.rollback();
        formatResponse(res, 500, error.message, null);
    }
};

const createMobil = async (req, res) => {
    try {
        const { name, vendor, vendor_link } = req.body;
        const mobil = await Mobil.create({ name, vendor, vendor_link });
        formatResponse(res, 201, 'Mobil created successfully', mobil);
    } catch (error) {
        formatResponse(res, 500, error.message, null);
    }
};

const getAllMobil = async (req, res) => {
    try {
        const mobilList = await Mobil.findAll();
        formatResponse(res, 200, 'List of mobil', mobilList);
    } catch (error) {
        formatResponse(res, 500, error.message, null);
    }
};

const getMobilById = async (req, res) => {
    try {
        const mobil = await Mobil.findByPk(req.params.id);
        if (!mobil) {
            return formatResponse(res, 404, 'Mobil not found', null);
        }
        formatResponse(res, 200, 'Mobil found', mobil);
    } catch (error) {
        formatResponse(res, 500, error.message, null);
    }
};

const updateMobil = async (req, res) => {
    try {
        const { name, vendor, vendor_link } = req.body;
        const mobil = await Mobil.findByPk(req.params.id);
        if (!mobil) {
            return formatResponse(res, 404, 'Mobil not found', null);
        }

        await mobil.update({ name, vendor, vendor_link });
        formatResponse(res, 200, 'Mobil updated successfully', mobil);
    } catch (error) {
        formatResponse(res, 500, error.message, null);
    }
};

const deleteMobil = async (req, res) => {
    try {
        const mobil = await Mobil.findByPk(req.params.id);
        if (!mobil) {
            return formatResponse(res, 404, 'Mobil not found', null);
        }

        await mobil.destroy();
        formatResponse(res, 200, 'Mobil deleted successfully', null);
    } catch (error) {
        formatResponse(res, 500, error.message, null);
    }
};

const updateFullMobil = async (req, res) => {
    const t = await Mobil.sequelize.transaction();
    try {
        const { id } = req.params;
        const { name, vendor, vendor_link, keterangan } = req.body;

        if (!keterangan) {
            await t.rollback();
            return formatResponse(res, 400, 'Keterangan tidak boleh kosong', null);
        }

        const mobil = await Mobil.findByPk(id);
        if (!mobil) {
            await t.rollback();
            return formatResponse(res, 404, 'Mobil not found', null);
        }

        // Update data utama mobil
        await mobil.update({ name, vendor, vendor_link }, { transaction: t });

        // Hapus semua data turunan
        await Promise.all([
            Fullday.destroy({ where: { id_mobil: id }, transaction: t }),
            Halfday.destroy({ where: { id_mobil: id }, transaction: t }),
            Inout.destroy({ where: { id_mobil: id }, transaction: t }),
            Menginap.destroy({ where: { id_mobil: id }, transaction: t }),
        ]);

        // Insert ulang data turunan
        const { fullDay, halfDay, inOut, menginap } = keterangan;

        if (Array.isArray(fullDay)) {
            const data = fullDay.map(item => ({
                id_mobil: id,
                area_name: item.area,
                price: item.price
            }));
            await Fullday.bulkCreate(data, { transaction: t });
        }

        if (Array.isArray(halfDay)) {
            const data = halfDay.map(item => ({
                id_mobil: id,
                area_name: item.area,
                price: item.price
            }));
            await Halfday.bulkCreate(data, { transaction: t });
        }

        if (Array.isArray(inOut)) {
            const data = inOut.map(item => ({
                id_mobil: id,
                area_name: item.area,
                price: item.price
            }));
            await Inout.bulkCreate(data, { transaction: t });
        }

        if (Array.isArray(menginap)) {
            const data = menginap.map(item => ({
                id_mobil: id,
                area_name: item.area,
                price: item.price
            }));
            await Menginap.bulkCreate(data, { transaction: t });
        }

        await t.commit();
        formatResponse(res, 200, 'Mobil dan seluruh harga berhasil diupdate', { id });
    } catch (error) {
        await t.rollback();
        formatResponse(res, 500, error.message, null);
    }
};

module.exports = {
    createMobil,
    getAllMobil,
    getMobilById,
    updateMobil,
    deleteMobil,
    createFullMobil,
    getAllMobilFull,
    deleteFullMobil,
    updateFullMobil
};
