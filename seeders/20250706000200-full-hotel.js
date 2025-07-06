'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const t = await queryInterface.sequelize.transaction();

    try {
      // 1. Insert ke tabel `hotel`
      const [hotel] = await queryInterface.bulkInsert('hotel', [{
        name: 'Adhi Jaya Hotel Kuta',
        star: 4,
        link_photo: 'https://example.com/adhi-jaya.jpg',
        createdAt: new Date(),
        updatedAt: new Date()
      }], { returning: true, transaction: t });

      // 2. Insert ke `tipe_room`
      const typeRooms = [
        {
          id_hotel: hotel.id,
          name: 'Superior',
          extrabed_price: 300000,
          contract_limit: '2025-12-31',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id_hotel: hotel.id,
          name: 'Deluxe',
          extrabed_price: 400000,
          contract_limit: '2025-12-31',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      const createdRooms = await queryInterface.bulkInsert('tipe_room', typeRooms, {
        returning: true,
        transaction: t
      });

      // Map nama → id untuk relasi season
      const roomMap = {};
      createdRooms.forEach(room => {
        roomMap[room.name] = room.id;
      });

      // 3. Insert ke `normalseason`
      await queryInterface.bulkInsert('normalseason', [
        {
          id_hotel: hotel.id,
          id_tipe_room: roomMap['Superior'],
          price: 650000,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id_hotel: hotel.id,
          id_tipe_room: roomMap['Deluxe'],
          price: 750000,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      // 4. Insert ke `highseason`
      await queryInterface.bulkInsert('highseason', [
        {
          id_hotel: hotel.id,
          id_tipe_room: roomMap['Superior'],
          name: 'Lebaran',
          price: 850000,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id_hotel: hotel.id,
          id_tipe_room: roomMap['Deluxe'],
          name: 'Lebaran',
          price: 950000,
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ], { transaction: t });

      // 5. Insert ke `peakseason`
      await queryInterface.bulkInsert('peakseason', [
        {
          id_hotel: hotel.id,
          id_tipe_room: roomMap['Superior'],
          name: 'New Year',
          price: 1200000,
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          id_hotel: hotel.id,
          id_tipe_room: roomMap['Deluxe'],
          name: 'New Year',
          price: 1350000,
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
    await queryInterface.bulkDelete('peakseason', null, {});
    await queryInterface.bulkDelete('highseason', null, {});
    await queryInterface.bulkDelete('normalseason', null, {});
    await queryInterface.bulkDelete('tipe_room', null, {});
    await queryInterface.bulkDelete('hotel', null, {});
  }
};
