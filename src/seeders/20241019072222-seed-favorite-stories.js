'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'favorite_stories',
      [
        {
          user_id: 1,
          story_id: 1,
          created_at: new Date(),
        },
        // Thêm các mục yêu thích khác tương tự...
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('favorite_stories', null, {})
  },
}
