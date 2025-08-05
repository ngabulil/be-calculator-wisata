'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('paket_destinasi', 'no', {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0, // agar tidak error karena existing data
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('paket_destinasi', 'no');
  }
};
