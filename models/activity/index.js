const ActivityVendor = require('./ActivityVendor');
const ActivityDetail = require('./ActivityDetail');

// Relasi antara ActivityVendor dan ActivityDetail
ActivityVendor.hasMany(ActivityDetail, {
  foreignKey: 'vendor_id',
  as: 'activities'
});

ActivityDetail.belongsTo(ActivityVendor, {
  foreignKey: 'vendor_id',
  as: 'vendor'
});

module.exports = {
  ActivityVendor,
  ActivityDetail,
};
