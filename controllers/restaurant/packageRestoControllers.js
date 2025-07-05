const { PackageResto } = require('../../models/restaurant');
const { formatResponse } = require('../../utils/formatResponse');

// CREATE
const createPackageResto = async (req, res) => {
  try {
    const {
      restaurant_id,
      name,
      price_domestic_adult,
      price_domestic_child,
      price_foreign_adult,
      price_foreign_child,
      pax,
      note,
      valid,
      link_contract
    } = req.body;

    const newPackage = await PackageResto.create({
      restaurant_id,
      name,
      price_domestic_adult,
      price_domestic_child,
      price_foreign_adult,
      price_foreign_child,
      pax,
      note,
      valid,
      link_contract
    });

    formatResponse(res, 201, 'Package Resto created successfully', newPackage);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// UPDATE
const updatePackageResto = async (req, res) => {
  try {
    const { id } = req.params;
    const packageResto = await PackageResto.findByPk(id);
    if (!packageResto) return formatResponse(res, 404, 'Package Resto not found', null);

    await packageResto.update(req.body);
    formatResponse(res, 200, 'Package Resto updated successfully', packageResto);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// DELETE
const deletePackageResto = async (req, res) => {
  try {
    const { id } = req.params;
    const packageResto = await PackageResto.findByPk(id);
    if (!packageResto) return formatResponse(res, 404, 'Package Resto not found', null);

    await packageResto.destroy();
    formatResponse(res, 200, 'Package Resto deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// GET BY ID
const getPackageRestoById = async (req, res) => {
  try {
    const { id } = req.params;
    const packageResto = await PackageResto.findByPk(id);
    if (!packageResto) return formatResponse(res, 404, 'Package Resto not found', null);

    formatResponse(res, 200, 'Package Resto found', packageResto);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// GET ALL
const getAllPackageRestos = async (req, res) => {
  try {
    const packages = await PackageResto.findAll();
    formatResponse(res, 200, 'Package Restos found', packages);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  createPackageResto,
  updatePackageResto,
  deletePackageResto,
  getPackageRestoById,
  getAllPackageRestos,
};
