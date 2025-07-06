'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('tiket_masuk', [
      {
        name: 'Garuda Wisnu Kencana (GWK)',
        price_foreign_adult: 125000,
        price_foreign_child: 90000,
        price_domestic_adult: 100000,
        price_domestic_child: 75000,
        note: 'Sudah termasuk tiket masuk dan akses ke taman budaya',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Pura Ulun Danu Beratan',
        price_foreign_adult: 75000,
        price_foreign_child: 50000,
        price_domestic_adult: 50000,
        price_domestic_child: 30000,
        note: 'Biaya masuk ke area pura dan danau',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Taman Safari Bali',
        price_foreign_adult: 200000,
        price_foreign_child: 150000,
        price_domestic_adult: 150000,
        price_domestic_child: 100000,
        note: 'Termasuk pertunjukan hewan dan safari tram',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tiket_masuk', null, {});
  }
};
