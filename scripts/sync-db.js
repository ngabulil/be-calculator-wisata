const sequelize = require('../config/db'); // sesuaikan path ke file koneksi Sequelize kamu
require('../models/index'); 

async function syncDB() {
  try {
    await sequelize.sync({ alter: true });
    console.log('✅ Database synchronized with models (alter applied)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Failed to sync database:', error.message);
    process.exit(1);
  }
}

syncDB();
