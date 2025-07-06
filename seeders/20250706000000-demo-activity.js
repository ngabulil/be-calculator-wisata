'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();

    try {
      // Insert ke activity_vendor
      const [vendorId] = await queryInterface.bulkInsert('activity_vendor', [{
        name: 'Bali Adventure Tours',
        createdAt: new Date(),
        updatedAt: new Date(),
      }], { returning: ['id'], transaction: t });

      // Insert ke activity_detail
      await queryInterface.bulkInsert('activity_detail', [
        {
          vendor_id: vendorId.id,
          name: 'Rafting Ayung River',
          price_foreign_adult: 50,
          price_foreign_child: 30,
          price_domestic_adult: 35,
          price_domestic_child: 20,
          keterangan: 'Termasuk makan siang',
          note: 'Minimal usia 7 tahun',
          valid: '2025-12-31',
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          vendor_id: vendorId.id,
          name: 'ATV Adventure',
          price_foreign_adult: 70,
          price_foreign_child: 50,
          price_domestic_adult: 55,
          price_domestic_child: 35,
          keterangan: '2 jam keliling desa',
          note: 'Sepatu tertutup wajib',
          valid: '2025-12-31',
          createdAt: new Date(),
          updatedAt: new Date(),
        }
      ], { transaction: t });

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('activity_detail', null, {});
    await queryInterface.bulkDelete('activity_vendor', null, {});
  }
};
