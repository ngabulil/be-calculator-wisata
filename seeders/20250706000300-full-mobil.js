'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();

    try {
      // 1. Insert ke `mobil`
      const [mobil] = await queryInterface.bulkInsert('mobil', [{
        name: 'Toyota Innova Reborn',
        vendor: 'PT. Bali Transport',
        vendor_link: 'https://example.com/innova',
        createdAt: new Date(),
        updatedAt: new Date()
      }], { returning: true, transaction: t });

      // 2. Insert ke `fullday`
      await queryInterface.bulkInsert('fullday', [
        {
          id_mobil: mobil.id,
          area_name: 'Kuta Area',
          price: 600000,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id_mobil: mobil.id,
          area_name: 'Ubud Area',
          price: 700000,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      // 3. Insert ke `halfday`
      await queryInterface.bulkInsert('halfday', [
        {
          id_mobil: mobil.id,
          area_name: 'Kuta Area',
          price: 400000,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      // 4. Insert ke `inout`
      await queryInterface.bulkInsert('inout', [
        {
          id_mobil: mobil.id,
          area_name: 'Bandara – Kuta',
          price: 150000,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      // 5. Insert ke `menginap`
      await queryInterface.bulkInsert('menginap', [
        {
          id_mobil: mobil.id,
          area_name: 'Trip Bali Area( Menginap)',
          price: 1200000,
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
    await queryInterface.bulkDelete('menginap', null, {});
    await queryInterface.bulkDelete('inout', null, {});
    await queryInterface.bulkDelete('halfday', null, {});
    await queryInterface.bulkDelete('fullday', null, {});
    await queryInterface.bulkDelete('mobil', null, {});
  }
};
