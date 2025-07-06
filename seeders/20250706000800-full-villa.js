'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();

    try {
      // 1. Insert ke tabel villa
      const [villa] = await queryInterface.bulkInsert('villa', [{
        name: 'Villa Awan Putih',
        star: 5,
        link_photo: 'https://example.com/villa.jpg',
        link_additional: 'https://example.com/additional.pdf',
        createdAt: new Date(),
        updatedAt: new Date()
      }], { returning: true, transaction: t });

      // 2. Insert ke tipe_room_villa
      const [tipeRoom] = await queryInterface.bulkInsert('tipe_room_villa', [{
        id_villa: villa.id,
        name: 'Private Pool Villa',
        extrabed_price: 400000,
        additional: 'Free breakfast setiap pagi',
        contract_limit: '2025-12-31',
        createdAt: new Date(),
        updatedAt: new Date()
      }], { returning: true, transaction: t });

      const idTipeRoom = tipeRoom.id;

      // 3. Insert ke normalseason_villa
      await queryInterface.bulkInsert('normalseason_villa', [{
        id_villa: villa.id,
        id_tipe_room_villa: idTipeRoom,
        price: 1000000,
        createdAt: new Date(),
        updatedAt: new Date()
      }], { transaction: t });

      // 4. Insert ke highseason_villa
      await queryInterface.bulkInsert('highseason_villa', [{
        id_villa: villa.id,
        id_tipe_room_villa: idTipeRoom,
        name: 'Idul Fitri',
        price: 1300000,
        createdAt: new Date(),
        updatedAt: new Date()
      }], { transaction: t });

      // 5. Insert ke peakseason_villa
      await queryInterface.bulkInsert('peakseason_villa', [{
        id_villa: villa.id,
        id_tipe_room_villa: idTipeRoom,
        name: 'Tahun Baru',
        price: 1600000,
        createdAt: new Date(),
        updatedAt: new Date()
      }], { transaction: t });

      // 6. Insert ke honeymoon_villa
      await queryInterface.bulkInsert('honeymoon_villa', [{
        id_villa: villa.id,
        id_tipe_room_villa: idTipeRoom,
        price: 1800000,
        createdAt: new Date(),
        updatedAt: new Date()
      }], { transaction: t });

      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('honeymoon_villa', null, {});
    await queryInterface.bulkDelete('peakseason_villa', null, {});
    await queryInterface.bulkDelete('highseason_villa', null, {});
    await queryInterface.bulkDelete('normalseason_villa', null, {});
    await queryInterface.bulkDelete('tipe_room_villa', null, {});
    await queryInterface.bulkDelete('villa', null, {});
  }
};
