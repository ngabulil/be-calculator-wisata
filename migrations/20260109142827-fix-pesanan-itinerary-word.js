'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const desc = await queryInterface.describeTable('pesanan');

    if (!desc.itinerary_word) {
      await queryInterface.addColumn('pesanan', 'itinerary_word', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  async down(queryInterface, Sequelize) {
    // biasanya fix migration tidak perlu drop kolom,
    // tapi kalau kamu mau bisa aktifkan:
    // await queryInterface.removeColumn('pesanan', 'itinerary_word');
  },
};
