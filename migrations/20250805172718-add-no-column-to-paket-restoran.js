'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('paket_restoran', 'no', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // supaya data lama tidak error
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('paket_restoran', 'no');
  }
};
