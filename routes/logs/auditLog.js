const { getAllAuditLogs } = require("../../controllers/logs/auditLogController");
const auth = require('../../middlewares/authMiddleware'); // JWT auth middleware
const express = require('express');
const router = express.Router();

router.get('/', auth, getAllAuditLogs);

module.exports = router;