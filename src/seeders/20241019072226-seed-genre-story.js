'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'genre_story',
      [
        {
          genre_id: 1,
          story_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Thêm các mối quan hệ giữa genre và story khác tương tự...
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('genre_story', null, {})
  },
}
