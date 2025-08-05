'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();

    try {
      // 1. Insert ke `paket`
      const [paketId] = await queryInterface.bulkInsert('paket', [{
        name: 'Paket Liburan Bali 3 Hari 2 Malam',
        description: 'Liburan lengkap ke Bali termasuk hotel, aktivitas, dan transportasi.',
        createdAt: new Date(),
        updatedAt: new Date()
      }], { returning: ['id'], transaction: t });

      const paket_id = paketId.id;

      // 2. Insert ke `paket_day`
      const [dayId] = await queryInterface.bulkInsert('paket_day', [{
        paket_id,
        name: 'Day 1',
        description_day: 'Penjemputan bandara dan check-in hotel.',
        createdAt: new Date(),
        updatedAt: new Date()
      }], { returning: ['id'], transaction: t });

      const paket_day_id = dayId.id;

      // 3. Insert Akomodasi
      await queryInterface.bulkInsert('paket_hotel', [
        {
          paket_day_id,
          id_hotel: 1,
          id_tipe_kamar: 1,
          season_type: 'normal',
          id_musim: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      await queryInterface.bulkInsert('paket_villa', [
        {
          paket_day_id,
          id_villa: 1,
          id_tipe_kamar: 1,
          season_type: 'high',
          id_musim: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      await queryInterface.bulkInsert('paket_additional_akomodasi', [
        {
          paket_day_id,
          id_additional: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      // 4. Insert Tour (dengan kolom `no`)
      await queryInterface.bulkInsert('paket_destinasi', [
        {
          paket_day_id,
          no: 1,
          id_destinasi: 1,
          type_wisata: 'domestik',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      await queryInterface.bulkInsert('paket_aktivitas', [
        {
          paket_day_id,
          no: 2,
          id_vendor: 1,
          id_activity: 1,
          type_wisata: 'asing',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      await queryInterface.bulkInsert('paket_restoran', [
        {
          paket_day_id,
          no: 3,
          id_resto: 1,
          id_menu: 1,
          type_wisata: 'asing',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      // 5. Insert Transport
      await queryInterface.bulkInsert('paket_transport_mobil', [
        {
          paket_day_id,
          id_mobil: 1,
          keterangan: 'fullday',
          id_area: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      await queryInterface.bulkInsert('paket_transport_additional', [
        {
          paket_day_id,
          id_additional: 1,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();
    try {
      // Temukan paket yang akan dihapus berdasarkan name
      const [paket] = await queryInterface.sequelize.query(
        `SELECT id FROM paket WHERE name = 'Paket Liburan Bali 3 Hari 2 Malam'`,
        { type: Sequelize.QueryTypes.SELECT, transaction: t }
      );

      if (paket && paket.id) {
        const paket_id = paket.id;

        // Temukan semua paket_day yang terkait
        const days = await queryInterface.sequelize.query(
          `SELECT id FROM paket_day WHERE paket_id = ${paket_id}`,
          { type: Sequelize.QueryTypes.SELECT, transaction: t }
        );

        const dayIds = days.map(d => d.id);

        // Hapus relasi berdasarkan paket_day_id
        await queryInterface.bulkDelete('paket_transport_additional', {
          paket_day_id: dayIds
        }, { transaction: t });

        await queryInterface.bulkDelete('paket_transport_mobil', {
          paket_day_id: dayIds
        }, { transaction: t });

        await queryInterface.bulkDelete('paket_restoran', {
          paket_day_id: dayIds
        }, { transaction: t });

        await queryInterface.bulkDelete('paket_aktivitas', {
          paket_day_id: dayIds
        }, { transaction: t });

        await queryInterface.bulkDelete('paket_destinasi', {
          paket_day_id: dayIds
        }, { transaction: t });

        await queryInterface.bulkDelete('paket_additional_akomodasi', {
          paket_day_id: dayIds
        }, { transaction: t });

        await queryInterface.bulkDelete('paket_villa', {
          paket_day_id: dayIds
        }, { transaction: t });

        await queryInterface.bulkDelete('paket_hotel', {
          paket_day_id: dayIds
        }, { transaction: t });

        await queryInterface.bulkDelete('paket_day', {
          paket_id
        }, { transaction: t });

        await queryInterface.bulkDelete('paket', {
          id: paket_id
        }, { transaction: t });
      }

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
};
