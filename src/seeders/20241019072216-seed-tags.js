'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'tags',
      [
        {
          tag_name: 'Epic',
          tag_slug: 'epic',
        },
        // Thêm các thẻ khác tương tự...
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('tags', null, {})
  },
}
