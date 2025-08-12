'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      // 1) Tambah kolom (nullable dulu agar tidak gagal pada existing rows)
      await queryInterface.addColumn(
        'paket',
        'created_by',
        { type: Sequelize.INTEGER, allowNull: true },
        { transaction: t }
      );

      await queryInterface.addColumn(
        'paket',
        'updated_by',
        { type: Sequelize.INTEGER, allowNull: true },
        { transaction: t }
      );

      // 2) Tambah FK ke admin(id)
      await queryInterface.addConstraint('paket', {
        fields: ['created_by'],
        type: 'foreign key',
        name: 'fk_paket_created_by_admin',
        references: { table: 'admin', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT', // sesuaikan kebijakan kamu
        transaction: t
      });

      await queryInterface.addConstraint('paket', {
        fields: ['updated_by'],
        type: 'foreign key',
        name: 'fk_paket_updated_by_admin',
        references: { table: 'admin', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL', // updater bisa null kalau admin dihapus
        transaction: t
      });

      // 3) (opsional) index untuk performa
      await queryInterface.addIndex('paket', ['created_by'], {
        name: 'idx_paket_created_by',
        transaction: t
      });
      await queryInterface.addIndex('paket', ['updated_by'], {
        name: 'idx_paket_updated_by',
        transaction: t
      });
    });
  },

  down: async (queryInterface/*, Sequelize */) => {
    await queryInterface.sequelize.transaction(async (t) => {
      await queryInterface.removeIndex('paket', 'idx_paket_created_by', { transaction: t });
      await queryInterface.removeIndex('paket', 'idx_paket_updated_by', { transaction: t });

      await queryInterface.removeConstraint('paket', 'fk_paket_created_by_admin', { transaction: t });
      await queryInterface.removeConstraint('paket', 'fk_paket_updated_by_admin', { transaction: t });

      await queryInterface.removeColumn('paket', 'created_by', { transaction: t });
      await queryInterface.removeColumn('paket', 'updated_by', { transaction: t });
    });
  }
};
