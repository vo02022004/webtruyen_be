'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'chapters',
      [
        {
          chapter_name: 'Chapter 1 of Story One',
          content: 'Content for chapter 1 of story one',
          story_id: 1,
          slug: 'chapter-1-story-one',
          views: 50,
          status: true,
          chapter_order: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        // Thêm các chương khác tương tự...
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('chapters', null, {})
  },
}
