const { ActivityVendor, ActivityDetail } = require('../../models/activity'); // sesuaikan path jika perlu
const { formatResponse } = require('../../utils/formatResponse');

// CREATE FULL
const createFullActivity = async (req, res) => {
    const t = await ActivityVendor.sequelize.transaction();

    try {
        const { name_vendor, activities } = req.body;

        if (!name_vendor || !Array.isArray(activities) || activities.length === 0) {
            return formatResponse(res, 400, 'Vendor name and at least one activity are required', null);
        }

        // Buat vendor
        const newVendor = await ActivityVendor.create({ name: name_vendor }, { transaction: t });

        // Tambah activity satu per satu
        const activityList = await Promise.all(
            activities.map((activity) => {
                return ActivityDetail.create({
                    vendor_id: newVendor.id,
                    name: activity.name,
                    description: activity.description,
                    price_foreign_adult: activity.price_foreign_adult,
                    price_foreign_child: activity.price_foreign_child,
                    price_domestic_adult: activity.price_domestic_adult,
                    price_domestic_child: activity.price_domestic_child,
                    keterangan: activity.keterangan,
                    note: activity.note,
                    valid: activity.valid,
                }, { transaction: t });
            })
        );

        await t.commit();

        formatResponse(res, 201, 'Vendor and activities created successfully', {
            id: newVendor.id,
            name_vendor: newVendor.name,
            activities: activityList.map((a) => ({
                activity_id: a.id,
                name: a.name,
                description: a.description,
                price_foreign_adult: a.price_foreign_adult,
                price_foreign_child: a.price_foreign_child,
                price_domestic_adult: a.price_domestic_adult,
                price_domestic_child: a.price_domestic_child,
                keterangan: a.keterangan,
                note: a.note,
                valid: a.valid,
            })),
        });
    } catch (err) {
        await t.rollback();
        formatResponse(res, 500, err.message, null);
    }
};

// GET ALL FULL
const getFullActivity = async (req, res) => {
    try {
        const vendors = await ActivityVendor.findAll({
            include: {
                model: ActivityDetail,
                as: 'activities',
            },
        });

        const result = vendors.map((vendor) => ({
            id: vendor.id,
            name_vendor: vendor.name,
            activities: vendor.activities.map((act) => ({
                activity_id: act.id,
                vendor_id: act.vendor_id,
                name: act.name,
                description: act.description,
                price_foreign_adult: act.price_foreign_adult,
                price_foreign_child: act.price_foreign_child,
                price_domestic_adult: act.price_domestic_adult,
                price_domestic_child: act.price_domestic_child,
                keterangan: act.keterangan,
                note: act.note,
                valid: act.valid,
                createdAt: act.createdAt,
                updatedAt: act.updatedAt,
            })),
        }));

        formatResponse(res, 200, 'Full activity data fetched successfully', result);
    } catch (err) {
        formatResponse(res, 500, err.message, null);
    }
};

// CREATE
const createActivityVendor = async (req, res) => {
    try {
        const { name } = req.body;
        const newVendor = await ActivityVendor.create({ name });
        formatResponse(res, 201, 'Activity Vendor created successfully', newVendor);
    } catch (err) {
        formatResponse(res, 500, err.message, null);
    }
};

// UPDATE
const updateActivityVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;
        const vendor = await ActivityVendor.findByPk(id);
        if (!vendor) return formatResponse(res, 404, 'Activity Vendor not found', null);
        await vendor.update({ name });
        formatResponse(res, 200, 'Activity Vendor updated successfully', vendor);
    } catch (err) {
        formatResponse(res, 500, err.message, null);
    }
};

// DELETE
const deleteActivityVendor = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await ActivityVendor.findByPk(id);
        if (!vendor) return formatResponse(res, 404, 'Activity Vendor not found', null);
        await vendor.destroy();
        formatResponse(res, 200, 'Activity Vendor deleted successfully', null);
    } catch (err) {
        formatResponse(res, 500, err.message, null);
    }
};

// GET BY ID
const getActivityVendorById = async (req, res) => {
    try {
        const { id } = req.params;
        const vendor = await ActivityVendor.findByPk(id);
        if (!vendor) return formatResponse(res, 404, 'Activity Vendor not found', null);
        formatResponse(res, 200, 'Activity Vendor found', vendor);
    } catch (err) {
        formatResponse(res, 500, err.message, null);
    }
};

// GET ALL
const getAllActivityVendors = async (req, res) => {
    try {
        const vendors = await ActivityVendor.findAll();
        formatResponse(res, 200, 'Activity Vendors found', vendors);
    } catch (err) {
        formatResponse(res, 500, err.message, null);
    }
};

const updateFullActivity = async (req, res) => {
  const t = await ActivityVendor.sequelize.transaction();

  try {
    const { id } = req.params;
    const { name_vendor, activities } = req.body;

    if (!name_vendor || !Array.isArray(activities)) {
      return formatResponse(res, 400, 'Vendor name and activities array are required', null);
    }

    // Ambil vendor dan semua activity-nya
    const vendor = await ActivityVendor.findByPk(id, {
      include: { model: ActivityDetail, as: 'activities' },
      transaction: t,
    });

    if (!vendor) {
      await t.rollback();
      return formatResponse(res, 404, 'Activity Vendor not found', null);
    }

    // Update nama vendor
    await vendor.update({ name: name_vendor }, { transaction: t });

    // Hapus seluruh activity lama
    await Promise.all(
      vendor.activities.map(act => act.destroy({ transaction: t }))
    );

    // Tambah ulang activity baru
    const newActivities = await Promise.all(
      activities.map(act =>
        ActivityDetail.create({
          vendor_id: vendor.id,
          name: act.name,
          description: act.description,
          price_foreign_adult: act.price_foreign_adult,
          price_foreign_child: act.price_foreign_child,
          price_domestic_adult: act.price_domestic_adult,
          price_domestic_child: act.price_domestic_child,
          keterangan: act.keterangan,
          note: act.note,
          valid: act.valid,
        }, { transaction: t })
      )
    );

    await t.commit();

    formatResponse(res, 200, 'Activity Vendor and details updated successfully', {
      id: vendor.id,
      name_vendor: vendor.name,
      activities: newActivities.map((a) => ({
        activity_id: a.id,
        ...a.dataValues,
      })),
    });
  } catch (err) {
    await t.rollback();
    formatResponse(res, 500, err.message, null);
  }
};

const deleteFullActivity = async (req, res) => {
  const t = await ActivityVendor.sequelize.transaction();

  try {
    const { id } = req.params;

    const vendor = await ActivityVendor.findByPk(id, {
      include: { model: ActivityDetail, as: 'activities' },
      transaction: t,
    });

    if (!vendor) {
      await t.rollback();
      return formatResponse(res, 404, 'Activity Vendor not found', null);
    }

    // Hapus semua activity dulu
    await Promise.all(
      vendor.activities.map(act => act.destroy({ transaction: t }))
    );

    // Hapus vendor
    await vendor.destroy({ transaction: t });

    await t.commit();
    formatResponse(res, 200, 'Activity Vendor and all activities deleted successfully', null);
  } catch (err) {
    await t.rollback();
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
    createActivityVendor,
    updateActivityVendor,
    deleteActivityVendor,
    getActivityVendorById,
    getAllActivityVendors,
    createFullActivity,
    getFullActivity,
    updateFullActivity,
    deleteFullActivity
};
