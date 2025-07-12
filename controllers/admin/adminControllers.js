const Admin = require('../../models/admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { formatResponse } = require('../../utils/formatResponse');

const SECRET_KEY = process.env.JWT_SECRET || 'secretkey';

// CREATE SUPER ADMIN
const createSuperAdmin = async (req, res) => {
  try {
    const { username, password, name } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({
      username,
      password: hash,
      name,
      role: 'super_admin'
    });

    formatResponse(res, 201, 'Super Admin created successfully', {
      id: newAdmin.id,
      username: newAdmin.username,
      name: newAdmin.name,
      role: newAdmin.role
    });
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// CREATE ADMIN (Hanya Super Admin)
const createAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return formatResponse(res, 403, 'Forbidden: Only super_admin can create admin', null);
    }

    const { username, password, name, role = 'admin' } = req.body;

    const hash = await bcrypt.hash(password, 10);
    const newAdmin = await Admin.create({ username, password: hash, name, role });

    formatResponse(res, 201, 'Admin created successfully', {
      id: newAdmin.id,
      username: newAdmin.username,
      name: newAdmin.name,
      role: newAdmin.role
    });
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// LOGIN
const loginAdmin = async (req, res) => {
  try {
    const { username, password } = req.body;

    const admin = await Admin.findOne({ where: { username } });
    if (!admin) return formatResponse(res, 401, 'Invalid credentials', null);

    const valid = await bcrypt.compare(password, admin.password);
    if (!valid) return formatResponse(res, 401, 'Invalid credentials', null);

    const token = jwt.sign(
      { id: admin.id, username: admin.username, role: admin.role },
      SECRET_KEY,
      { expiresIn: '1d' }
    );

    formatResponse(res, 200, 'Login successful', { token });
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// UPDATE ADMIN
const updateAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return formatResponse(res, 403, 'Forbidden: Only super_admin can update admin', null);
    }

    const { id } = req.params;
    const { username, password, name, role } = req.body;

    const admin = await Admin.findByPk(id);
    if (!admin) return formatResponse(res, 404, 'Admin not found', null);

    const updateData = { username, name };
    if (password) updateData.password = await bcrypt.hash(password, 10);
    if (role) updateData.role = role;

    await admin.update(updateData);

    formatResponse(res, 200, 'Admin updated successfully', {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role
    });
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// DELETE ADMIN
const deleteAdmin = async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return formatResponse(res, 403, 'Forbidden: Only super_admin can delete admin', null);
    }

    const { id } = req.params;
    const admin = await Admin.findByPk(id);
    if (!admin) return formatResponse(res, 404, 'Admin not found', null);

    await admin.destroy();
    formatResponse(res, 200, 'Admin deleted successfully', null);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// GET BY ID
const getAdminById = async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return formatResponse(res, 403, 'Forbidden: Only super_admin can access this', null);
    }

    const { id } = req.params;
    const admin = await Admin.findByPk(id, {
      attributes: { exclude: ['password'] }
    });
    if (!admin) return formatResponse(res, 404, 'Admin not found', null);

    formatResponse(res, 200, 'Admin found', admin);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

// GET ALL
const getAllAdmins = async (req, res) => {
  try {
    if (req.user.role !== 'super_admin') {
      return formatResponse(res, 403, 'Forbidden: Only super_admin can access this', null);
    }

    const admins = await Admin.findAll({
      attributes: { exclude: ['password'] }
    });

    formatResponse(res, 200, 'Admins found', admins);
  } catch (err) {
    formatResponse(res, 500, err.message, null);
  }
};

module.exports = {
  createAdmin,
  createSuperAdmin,
  loginAdmin,
  updateAdmin,
  deleteAdmin,
  getAdminById,
  getAllAdmins
};
