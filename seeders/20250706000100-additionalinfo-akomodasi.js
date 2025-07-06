'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('additionalinfo_akomodasi', [
      {
        name: 'Welcome Drink',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Late Checkout',
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: 'Airport Pickup',
        createdAt: new Date(),
        updatedAt: new Date(),
      }
    ], {});
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('additionalinfo_akomodasi', null, {});
  }
};
