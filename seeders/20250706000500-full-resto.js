'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();
    try {
      // 1. Insert restoran
      const [resto] = await queryInterface.bulkInsert('restaurant', [{
        name: 'Warung Ayam Bakar Taliwang',
        createdAt: new Date(),
        updatedAt: new Date()
      }], { returning: true, transaction: t });

      // 2. Insert package_resto
      await queryInterface.bulkInsert('package_resto', [
        {
          restaurant_id: resto.id,
          name: 'Paket A - Ayam Bakar + Nasi + Es Teh',
          price_domestic_adult: 60000,
          price_domestic_child: 40000,
          price_foreign_adult: 90000,
          price_foreign_child: 60000,
          pax: 1,
          note: 'Sudah termasuk pajak',
          valid: '2025-12-31',
          link_contract: 'https://example.com/contract-paket-a.pdf',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          restaurant_id: resto.id,
          name: 'Paket B - Ikan Bakar + Nasi + Jus',
          price_domestic_adult: 75000,
          price_domestic_child: 50000,
          price_foreign_adult: 110000,
          price_foreign_child: 80000,
          pax: 1,
          note: 'Minimal 2 pax',
          valid: '2025-12-31',
          link_contract: 'https://example.com/contract-paket-b.pdf',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('package_resto', null, {});
    await queryInterface.bulkDelete('restaurant', null, {});
  }
};
