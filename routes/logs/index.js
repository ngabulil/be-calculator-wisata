const router = require('express').Router();
const auditLogRoutes = require('./auditLog');

// Prefix: /api/paket
router.use('/', auditLogRoutes);

module.exports = router;
