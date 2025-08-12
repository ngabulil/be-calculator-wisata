'use strict';

const { Op } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();
    try {
      // 0) Cari admin untuk created_by / updated_by
      let admin = await queryInterface.sequelize.query(
        `SELECT id FROM admin WHERE role = 'super_admin' ORDER BY id LIMIT 1`,
        { type: Sequelize.QueryTypes.SELECT, transaction: t }
      );

      if (!admin || admin.length === 0) {
        admin = await queryInterface.sequelize.query(
          `SELECT id FROM admin ORDER BY id LIMIT 1`,
          { type: Sequelize.QueryTypes.SELECT, transaction: t }
        );
      }

      let adminId;
      if (admin && admin.length > 0) {
        adminId = admin[0].id;
      } else {
        // jika belum ada admin sama sekali, buat satu admin minimal
        const now = new Date();
        const username = 'seed_admin';
        const passwordHash = await bcrypt.hash('seed_password', 10); // hash bcrypt

        const insertedAdmins = await queryInterface.bulkInsert(
          'admin',
          [{
            username,
            password: passwordHash,
            name: 'Seed Admin',
            role: 'super_admin',
            createdAt: now,
            updatedAt: now
          }],
          { transaction: t, returning: true }
        );

        adminId = Array.isArray(insertedAdmins)
          ? (typeof insertedAdmins[0] === 'object' ? insertedAdmins[0].id : insertedAdmins[0])
          : insertedAdmins;
      }

      const now = new Date();

      // 1) Insert ke `paket`
      const paketInserted = await queryInterface.bulkInsert(
        'paket',
        [{
          name: 'Paket Liburan Bali 3 Hari 2 Malam',
          description: 'Liburan lengkap ke Bali termasuk hotel, aktivitas, dan transportasi.',
          created_by: adminId,
          updated_by: adminId,
          createdAt: now,
          updatedAt: now
        }],
        { transaction: t, returning: true }
      );

      const paketRow = Array.isArray(paketInserted)
        ? (typeof paketInserted[0] === 'object' ? paketInserted[0] : { id: paketInserted[0] })
        : { id: paketInserted };
      const paket_id = paketRow.id;

      // 2) Insert ke `paket_day`
      const dayInserted = await queryInterface.bulkInsert(
        'paket_day',
        [{
          paket_id,
          name: 'Day 1',
          description_day: 'Penjemputan bandara dan check-in hotel.',
          createdAt: now,
          updatedAt: now
        }],
        { transaction: t, returning: true }
      );

      const dayRow = Array.isArray(dayInserted)
        ? (typeof dayInserted[0] === 'object' ? dayInserted[0] : { id: dayInserted[0] })
        : { id: dayInserted };
      const paket_day_id = dayRow.id;

      // 3) Insert Akomodasi
      await queryInterface.bulkInsert('paket_hotel', [{
        paket_day_id,
        id_hotel: 1,
        id_tipe_kamar: 1,
        season_type: 'normal',
        id_musim: 1,
        createdAt: now,
        updatedAt: now
      }], { transaction: t });

      await queryInterface.bulkInsert('paket_villa', [{
        paket_day_id,
        id_villa: 1,
        id_tipe_kamar: 1,
        season_type: 'high',
        id_musim: 1,
        createdAt: now,
        updatedAt: now
      }], { transaction: t });

      await queryInterface.bulkInsert('paket_additional_akomodasi', [{
        paket_day_id,
        id_additional: 1,
        createdAt: now,
        updatedAt: now
      }], { transaction: t });

      // 4) Insert Tour
      await queryInterface.bulkInsert('paket_destinasi', [{
        paket_day_id,
        no: 1,
        id_destinasi: 1,
        type_wisata: 'domestik',
        createdAt: now,
        updatedAt: now
      }], { transaction: t });

      await queryInterface.bulkInsert('paket_aktivitas', [{
        paket_day_id,
        no: 2,
        id_vendor: 1,
        id_activity: 1,
        type_wisata: 'asing',
        createdAt: now,
        updatedAt: now
      }], { transaction: t });

      await queryInterface.bulkInsert('paket_restoran', [{
        paket_day_id,
        no: 3,
        id_resto: 1,
        id_menu: 1,
        type_wisata: 'asing',
        createdAt: now,
        updatedAt: now
      }], { transaction: t });

      // 5) Insert Transport
      await queryInterface.bulkInsert('paket_transport_mobil', [{
        paket_day_id,
        id_mobil: 1,
        keterangan: 'fullday',
        id_area: 1,
        createdAt: now,
        updatedAt: now
      }], { transaction: t });

      await queryInterface.bulkInsert('paket_transport_additional', [{
        paket_day_id,
        id_additional: 1,
        createdAt: now,
        updatedAt: now
      }], { transaction: t });

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();
    try {
      const paket = await queryInterface.sequelize.query(
        `SELECT id FROM paket WHERE name = :name`,
        {
          type: Sequelize.QueryTypes.SELECT,
          replacements: { name: 'Paket Liburan Bali 3 Hari 2 Malam' },
          transaction: t
        }
      );

      if (paket && paket.length > 0) {
        const paket_id = paket[0].id;

        const days = await queryInterface.sequelize.query(
          `SELECT id FROM paket_day WHERE paket_id = :paket_id`,
          {
            type: Sequelize.QueryTypes.SELECT,
            replacements: { paket_id },
            transaction: t
          }
        );

        const dayIds = days.map(d => d.id);

        if (dayIds.length > 0) {
          await queryInterface.bulkDelete('paket_transport_additional', { paket_day_id: { [Op.in]: dayIds } }, { transaction: t });
          await queryInterface.bulkDelete('paket_transport_mobil', { paket_day_id: { [Op.in]: dayIds } }, { transaction: t });
          await queryInterface.bulkDelete('paket_restoran', { paket_day_id: { [Op.in]: dayIds } }, { transaction: t });
          await queryInterface.bulkDelete('paket_aktivitas', { paket_day_id: { [Op.in]: dayIds } }, { transaction: t });
          await queryInterface.bulkDelete('paket_destinasi', { paket_day_id: { [Op.in]: dayIds } }, { transaction: t });
          await queryInterface.bulkDelete('paket_additional_akomodasi', { paket_day_id: { [Op.in]: dayIds } }, { transaction: t });
          await queryInterface.bulkDelete('paket_villa', { paket_day_id: { [Op.in]: dayIds } }, { transaction: t });
          await queryInterface.bulkDelete('paket_hotel', { paket_day_id: { [Op.in]: dayIds } }, { transaction: t });
          await queryInterface.bulkDelete('paket_day', { paket_id }, { transaction: t });
        }

        await queryInterface.bulkDelete('paket', { id: paket_id }, { transaction: t });
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
};
