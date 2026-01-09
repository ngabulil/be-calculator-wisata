'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    // Ambil semua tabel di schema public (Postgres)
    const [rows] = await queryInterface.sequelize.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT IN ('SequelizeMeta', 'SequelizeData', 'audit_logs');
    `);

    for (const r of rows) {
      const table = r.tablename;

      // cek kolom yang sudah ada
      const desc = await queryInterface.describeTable(table);

      // Tambahkan deletedAt kalau belum ada
      if (!desc.deletedAt) {
        await queryInterface.addColumn(table, 'deletedAt', {
          type: Sequelize.DATE,
          allowNull: true,
        });
      }

      // Tambah index untuk deletedAt (opsional tapi recommended)
      // Biar aman, coba tambahkan; kalau gagal karena sudah ada, diabaikan.
      const indexName = `${table}_deletedAt_idx`;
      try {
        await queryInterface.addIndex(table, ['deletedAt'], { name: indexName });
      } catch (e) {
        // abaikan error index duplicate / sudah ada / nama bentrok
      }
    }
  },

  async down(queryInterface) {
    const [rows] = await queryInterface.sequelize.query(`
      SELECT tablename
      FROM pg_tables
      WHERE schemaname = 'public'
        AND tablename NOT IN ('SequelizeMeta', 'SequelizeData', 'audit_logs');
    `);

    for (const r of rows) {
      const table = r.tablename;
      const desc = await queryInterface.describeTable(table);

      // Hapus index dulu (kalau ada)
      const indexName = `${table}_deletedAt_idx`;
      try {
        await queryInterface.removeIndex(table, indexName);
      } catch (e) {
        // abaikan kalau index tidak ada / beda nama
      }

      // Hapus kolom deletedAt kalau ada
      if (desc.deletedAt) {
        await queryInterface.removeColumn(table, 'deletedAt');
      }
    }
  },
};
