'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'genres',
      [
        {
          genre_name: 'Action',
          description: 'Action genre description',
          slug: 'action',
        },
        // Thêm các thể loại khác tương tự...
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('genres', null, {})
  },
}
