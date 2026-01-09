const { Admin } = require('../admin/index');
const AuditLog = require('./AuditLog');

// 1 Admin bisa punya banyak audit log
Admin.hasMany(AuditLog, {
  foreignKey: 'admin_id',
  as: 'audit_logs',
});

// 1 audit log milik 1 admin
AuditLog.belongsTo(Admin, {
  foreignKey: 'admin_id',
  as: 'admin',
});

module.exports = {
  AuditLog,
};
