'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    const desc = await queryInterface.describeTable('pesanan');

    // kalau kolom belum ada di env tertentu, baru dibuat
    if (!desc.id_paket) {
      await queryInterface.addColumn('pesanan', 'id_paket', {
        type: Sequelize.INTEGER,
        allowNull: true,
      });
    }

    // pastikan index ada
    const indexName = 'idx_pesanan_id_paket';
    try {
      await queryInterface.addIndex('pesanan', ['id_paket'], { name: indexName });
    } catch (e) {}

    // pastikan FK ada (dengan nama constraint yang jelas)
    const constraintName = 'fk_pesanan_id_paket__paket_id';
    const [fk] = await queryInterface.sequelize.query(
      `SELECT conname FROM pg_constraint WHERE conname = :name`,
      { replacements: { name: constraintName } }
    );

    if (!fk || fk.length === 0) {
      await queryInterface.addConstraint('pesanan', {
        fields: ['id_paket'],
        type: 'foreign key',
        name: constraintName,
        references: { table: 'paket', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
      });
    }
  },

  async down(queryInterface) {
    // biasanya migration fix tidak perlu rollback kolom
    // tapi index & FK boleh dihapus
    try { await queryInterface.removeIndex('pesanan', 'idx_pesanan_id_paket'); } catch (e) {}
    try { await queryInterface.removeConstraint('pesanan', 'fk_pesanan_id_paket__paket_id'); } catch (e) {}
  },
};
