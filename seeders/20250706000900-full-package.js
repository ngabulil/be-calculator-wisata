'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();

    try {
      // 1. Insert ke `paket`
      const [paket] = await queryInterface.bulkInsert('paket', [{
        name: 'Paket Liburan Bali 3 Hari 2 Malam',
        description: 'Liburan lengkap ke Bali termasuk hotel, aktivitas, dan transportasi.',
        createdAt: new Date(),
        updatedAt: new Date()
      }], { returning: true, transaction: t });

      // 2. Insert ke `paket_day`
      const [day] = await queryInterface.bulkInsert('paket_day', [{
        paket_id: paket.id,
        name: 'Day 1',
        description_day: 'Penjemputan bandara dan check-in hotel.',
        createdAt: new Date(),
        updatedAt: new Date()
      }], { returning: true, transaction: t });

      const paket_day_id = day.id;

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

      // 4. Insert Tour
      await queryInterface.bulkInsert('paket_destinasi', [
        {
          paket_day_id,
          id_destinasi: 1,
          type_wisata: 'domestik',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      await queryInterface.bulkInsert('paket_aktivitas', [
        {
          paket_day_id,
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
          id_resto: 1,
          id_menu: 1,
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
    await queryInterface.bulkDelete('paket_transport_additional', null, {});
    await queryInterface.bulkDelete('paket_transport_mobil', null, {});
    await queryInterface.bulkDelete('paket_restoran', null, {});
    await queryInterface.bulkDelete('paket_aktivitas', null, {});
    await queryInterface.bulkDelete('paket_destinasi', null, {});
    await queryInterface.bulkDelete('paket_additional_akomodasi', null, {});
    await queryInterface.bulkDelete('paket_villa', null, {});
    await queryInterface.bulkDelete('paket_hotel', null, {});
    await queryInterface.bulkDelete('paket_day', null, {});
    await queryInterface.bulkDelete('paket', null, {});
  }
};
