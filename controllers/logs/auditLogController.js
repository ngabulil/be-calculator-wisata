const { AuditLog } = require('../../models/logs/index');
const { Admin } = require('../../models/admin/index');
const { formatResponse } = require('../../utils/formatResponse');

const getAllAuditLogs = async (req, res) => {
  try {
    // ✅ Guard: hanya super_admin
    if (!req.user || req.user.role !== 'super_admin') {
      return formatResponse(res, 403, 'Akses ditolak: hanya super_admin', null);
    }

    const data = await AuditLog.findAll({
      include: [
        {
          model: Admin,
          as: 'admin', // pastikan relasi AuditLog.belongsTo(Admin, { as: 'admin' })
          attributes: ['id', 'username', 'name', 'role'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    // Bentuk response biar rapi (mirip gaya mapping kamu)
    const result = data.map((log) => ({
      id: log.id,
      admin_id: log.admin_id,
      admin: log.admin
        ? {
            id: log.admin.id,
            username: log.admin.username,
            name: log.admin.name,
            role: log.admin.role,
          }
        : null,

      action: log.action,
      path: log.path,
      status_code: log.status_code,

      ip: log.ip,
      user_agent: log.user_agent,

      body: log.body,
      message: log.message,

      createdAt: log.createdAt,
      updatedAt: log.updatedAt,
    }));

    return formatResponse(res, 200, 'List audit logs', result);
  } catch (error) {
    return formatResponse(res, 500, error.message, null);
  }
};

module.exports = { getAllAuditLogs };
