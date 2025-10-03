'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('pesanan', 'id_paket', {
      type: Sequelize.INTEGER,
      allowNull: true,
      references: {
        model: 'paket', // nama table yang jadi referensi
        key: 'id'
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL'
    });

    await queryInterface.addIndex('pesanan', ['id_paket'], {
      name: 'idx_pesanan_id_paket'
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('pesanan', 'idx_pesanan_id_paket').catch(() => {});
    await queryInterface.removeColumn('pesanan', 'id_paket');
  }
};
