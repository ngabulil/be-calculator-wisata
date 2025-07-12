const jwt = require('jsonwebtoken');
const Admin = require('../models/admin');

const SECRET_KEY = process.env.JWT_SECRET || 'secretkey';

const auth = async (req, res, next) => {
  const authHeader = req.headers.authorization;

  // Periksa apakah header Authorization ada dan benar formatnya
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ success: false, message: 'Unauthorized: Token not provided' });
  }

  const token = authHeader.split(' ')[1];

  try {
    // Verifikasi token
    const decoded = jwt.verify(token, SECRET_KEY);

    // Cari admin berdasarkan ID yang diambil dari token
    const admin = await Admin.findByPk(decoded.id);
    if (!admin) {
      return res.status(403).json({ success: false, message: 'Forbidden: Admin not found' });
    }

    // Simpan data admin yang terautentikasi di req.user
    req.user = {
      id: admin.id,
      username: admin.username,
      name: admin.name,
      role: admin.role
    };

    next(); // lanjut ke route/controller berikutnya
  } catch (err) {
    return res.status(403).json({ success: false, message: 'Forbidden: Invalid token' });
  }
};

module.exports = auth;
