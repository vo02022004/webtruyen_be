'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'stories',
      [
        {
          status: 1,
          author_id: 1,
          description: 'Story description 1',
          story_name: 'Story One',
          total_chapters: 3,
          views: 100,
          cover: 'cover1.jpg',
          keywords: 'keyword1, keyword2',
          slug: 'story-one',
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Thêm các câu chuyện khác tương tự...
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('stories', null, {})
  },
}
