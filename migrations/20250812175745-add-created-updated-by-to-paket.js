'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.sequelize.transaction(async (t) => {
      // 1) Tambah kolom (nullable dulu)
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

      // 2) Backfill existing rows -> set created_by = 1 kalau NULL
      await queryInterface.sequelize.query(
        'UPDATE "paket" SET "created_by" = 1 WHERE "created_by" IS NULL;',
        { transaction: t }
      );

      // 3) Jadikan NOT NULL + default 1 (supaya row baru punya nilai)
      await queryInterface.changeColumn(
        'paket',
        'created_by',
        { type: Sequelize.INTEGER, allowNull: false, defaultValue: 1 },
        { transaction: t }
      );
      // updated_by biarkan null (tidak perlu default)

      // 4) Tambah FK (DEFERRABLE)
      await queryInterface.addConstraint('paket', {
        fields: ['created_by'],
        type: 'foreign key',
        name: 'fk_paket_created_by_admin',
        references: { table: 'admin', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'RESTRICT',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        transaction: t,
      });

      await queryInterface.addConstraint('paket', {
        fields: ['updated_by'],
        type: 'foreign key',
        name: 'fk_paket_updated_by_admin',
        references: { table: 'admin', field: 'id' },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL',
        deferrable: Sequelize.Deferrable.INITIALLY_IMMEDIATE,
        transaction: t,
      });

      // 5) Index (tanpa CONCURRENTLY karena sedang di dalam transaction)
      await queryInterface.addIndex('paket', ['created_by'], {
        name: 'idx_paket_created_by',
        transaction: t,
      });
      await queryInterface.addIndex('paket', ['updated_by'], {
        name: 'idx_paket_updated_by',
        transaction: t,
      });
    });
  },

  down: async (queryInterface) => {
    await queryInterface.sequelize.transaction(async (t) => {
      // 1) Drop index kalau ada
      await queryInterface.sequelize.query(
        'DROP INDEX IF EXISTS "idx_paket_created_by";',
        { transaction: t }
      );
      await queryInterface.sequelize.query(
        'DROP INDEX IF EXISTS "idx_paket_updated_by";',
        { transaction: t }
      );

      // 2) Drop FK kalau ada
      await queryInterface.sequelize.query(
        'ALTER TABLE "paket" DROP CONSTRAINT IF EXISTS "fk_paket_created_by_admin";',
        { transaction: t }
      );
      await queryInterface.sequelize.query(
        'ALTER TABLE "paket" DROP CONSTRAINT IF EXISTS "fk_paket_updated_by_admin";',
        { transaction: t }
      );

      // (opsional) kembalikan kolom created_by jadi nullable dulu sebelum drop
      await queryInterface.sequelize.query(
        'ALTER TABLE "paket" ALTER COLUMN "created_by" DROP NOT NULL;',
        { transaction: t }
      );

      // 3) Drop kolom kalau ada
      await queryInterface.sequelize.query(
        'ALTER TABLE "paket" DROP COLUMN IF EXISTS "created_by";',
        { transaction: t }
      );
      await queryInterface.sequelize.query(
        'ALTER TABLE "paket" DROP COLUMN IF EXISTS "updated_by";',
        { transaction: t }
      );
    });
  }

};
