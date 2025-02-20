'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'reviews',
      [
        {
          user_id: 1,
          story_id: 1,
          star: 5,
          comment: 'Great story, loved it!',
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Thêm các đánh giá khác tương tự...
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('reviews', null, {})
  },
}
