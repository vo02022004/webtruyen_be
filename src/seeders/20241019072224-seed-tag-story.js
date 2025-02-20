'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'tag_story',
      [
        {
          tag_id: 1,
          story_id: 1,
          description: 'Epic story one',
        },
        // Thêm các mối quan hệ giữa tag và story khác tương tự...
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tag_story', null, {})
  },
}
