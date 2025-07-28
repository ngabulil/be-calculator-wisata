const { Restaurant, PackageResto } = require('../../models/restaurant');
const { formatResponse } = require('../../utils/formatResponse');

// CREATE FULL
const createFullResto = async (req, res) => {
  const t = await Restaurant.sequelize.transaction();

  try {
    const { resto_name, description, packages } = req.body;

    if (!resto_name || !Array.isArray(packages) || packages.length === 0) {
      return formatResponse(res, 400, 'Restaurant name and at least one package are required', null);
    }

    // Buat restoran
    const newResto = await Restaurant.create({ name: resto_name, description }, { transaction: t });

    // Buat semua package
    const createdPackages = await Promise.all(
      packages.map(pkg =>
        PackageResto.create({
          restaurant_id: newResto.id,
          name: pkg.name,
          price_domestic_adult: pkg.price_domestic_adult,
          price_domestic_child: pkg.price_domestic_child,
          price_foreign_adult: pkg.price_foreign_adult,
          price_foreign_child: pkg.price_foreign_child,
          pax: pkg.pax,
          note: pkg.note,
          valid: pkg.valid,
          link_contract: pkg.link_contract,
        }, { transaction: t })
      )
    );

    await t.commit();

    formatResponse(res, 201, 'Restaurant and packages created successfully', {
      id: newResto.id,
      resto_name: newResto.name,
      description: newResto.description,
      packages: createdPackages.map(pkg => ({
        id_package: pkg.id,
        ...pkg.dataValues
      })),
    });
  } catch (err) {
    await t.rollback();
    formatResponse(res, 500, err.message, null);
  }
};

// GET ALL FULL
const getAllRestoFull = async (req, res) => {
  try {
    const restos = await Restaurant.findAll({
      include: {
        model: PackageResto,
        as: 'packages',
      },
    });

    const result = restos.map((resto) => ({
      id: resto.id,
      resto_name: resto.name,
      description: resto.description,
      packages: resto.packages.map((pkg) => ({
        id: pkg.id,
        id_package: pkg.id,
        package_name: pkg.name,
        price_domestic_adult: pkg.price_domestic_adult,
        price_domestic_child: pkg.price_domestic_child,
        price_foreign_adult: pkg.price_foreign_adult,
        price_foreign_child: pkg.price_foreign_child,
        pax: pkg.pax,
        note: pkg.note,
        valid: pkg.valid,
        link_contract: pkg.link_contract,
        createdAt: pkg.createdAt,
        updatedAt: pkg.updatedAt,
      })),
    }));

    formatResponse(res, 200, 'Full restaurant data fetched successfully', result);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// CREATE
const createRestaurant = async (req, res) => {
  try {
    const { name, description } = req.body;
    const newRestaurant = await Restaurant.create({ name, description });
    formatResponse(res, 201, 'Restaurant created successfully', newRestaurant);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// UPDATE
const updateRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description } = req.body;
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) return formatResponse(res, 404, 'Restaurant not found', null);

    await restaurant.update({ name, description });
    formatResponse(res, 200, 'Restaurant updated successfully', restaurant);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// DELETE
const deleteRestaurant = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) return formatResponse(res, 404, 'Restaurant not found', null);

    await restaurant.destroy();
    formatResponse(res, 200, 'Restaurant deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// GET BY ID
const getRestaurantById = async (req, res) => {
  try {
    const { id } = req.params;
    const restaurant = await Restaurant.findByPk(id);
    if (!restaurant) return formatResponse(res, 404, 'Restaurant not found', null);

    formatResponse(res, 200, 'Restaurant found', restaurant);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// GET ALL
const getAllRestaurants = async (req, res) => {
  try {
    const restaurants = await Restaurant.findAll();
    formatResponse(res, 200, 'Restaurants found', restaurants);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

const deleteFullResto = async (req, res) => {
  const t = await Restaurant.sequelize.transaction();

  try {
    const { id } = req.params;

    const resto = await Restaurant.findByPk(id, {
      include: {
        model: PackageResto,
        as: 'packages',
      },
      transaction: t,
    });

    if (!resto) {
      await t.rollback();
      return formatResponse(res, 404, 'Restaurant not found', null);
    }

    // Hapus semua package terkait
    await Promise.all(
      resto.packages.map(pkg => pkg.destroy({ transaction: t }))
    );

    // Hapus restoran
    await resto.destroy({ transaction: t });

    await t.commit();
    formatResponse(res, 200, 'Restaurant and related packages deleted successfully', null);
  } catch (err) {
    await t.rollback();
    formatResponse(res, 500, err.message, null);
  }
};

const updateFullResto = async (req, res) => {
  const t = await Restaurant.sequelize.transaction();

  try {
    const { id } = req.params;
    const { resto_name, description, packages } = req.body;

    if (!resto_name || !Array.isArray(packages)) {
      await t.rollback();
      return formatResponse(res, 400, 'Restaurant name and packages array are required', null);
    }

    // ✅ Ambil data resto beserta paketnya
    const resto = await Restaurant.findByPk(id, {
      include: { model: PackageResto, as: 'packages' },
      transaction: t,
    });

    if (!resto) {
      await t.rollback();
      return formatResponse(res, 404, 'Restaurant not found', null);
    }

    // ✅ Update info restoran
    await resto.update({ name: resto_name, description }, { transaction: t });

    // ✅ Ambil daftar paket yang sudah ada
    const existingPackages = resto.packages;
    const incomingIds = packages.filter(p => p.id).map(p => p.id);

    // ✅ Update / Create paket
    const updatedPackages = [];

    for (const pkg of packages) {
      if (pkg.id) {
        const existing = existingPackages.find(p => p.id === pkg.id);
        if (existing) {
          await existing.update({
            name: pkg.name,
            price_domestic_adult: pkg.price_domestic_adult,
            price_domestic_child: pkg.price_domestic_child,
            price_foreign_adult: pkg.price_foreign_adult,
            price_foreign_child: pkg.price_foreign_child,
            pax: pkg.pax,
            note: pkg.note,
            valid: pkg.valid,
            link_contract: pkg.link_contract,
          }, { transaction: t });

          updatedPackages.push(existing);
          continue;
        }
      }

      // ➕ Buat baru
      const newPkg = await PackageResto.create({
        restaurant_id: resto.id,
        name: pkg.name,
        price_domestic_adult: pkg.price_domestic_adult,
        price_domestic_child: pkg.price_domestic_child,
        price_foreign_adult: pkg.price_foreign_adult,
        price_foreign_child: pkg.price_foreign_child,
        pax: pkg.pax,
        note: pkg.note,
        valid: pkg.valid,
        link_contract: pkg.link_contract,
      }, { transaction: t });

      updatedPackages.push(newPkg);
    }

    // ❌ Hapus paket yang tidak dikirim lagi
    const toDelete = existingPackages.filter(pkg => !incomingIds.includes(pkg.id));
    await Promise.all(toDelete.map(pkg => pkg.destroy({ transaction: t })));

    await t.commit();

    // ✅ Response
    formatResponse(res, 200, 'Restaurant and packages updated successfully', {
      id: resto.id,
      resto_name: resto.name,
      description: resto.description,
      packages: updatedPackages.map(pkg => ({
        id_package: pkg.id,
        name: pkg.name,
        price_domestic_adult: pkg.price_domestic_adult,
        price_domestic_child: pkg.price_domestic_child,
        price_foreign_adult: pkg.price_foreign_adult,
        price_foreign_child: pkg.price_foreign_child,
        pax: pkg.pax,
        note: pkg.note,
        valid: pkg.valid,
        link_contract: pkg.link_contract,
        createdAt: pkg.createdAt,
        updatedAt: pkg.updatedAt,
      })),
    });
  } catch (err) {
    await t.rollback();
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  createRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getRestaurantById,
  getAllRestaurants,
  getAllRestoFull,
  createFullResto,
  deleteFullResto,
  updateFullResto
};
