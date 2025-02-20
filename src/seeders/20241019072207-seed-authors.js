'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'authors',
      [
        {
          author_name: 'Author One',
          description: 'Description for author one',
          slug: 'author-one',
        },
        {
          author_name: 'Author Two',
          description: 'Description for author two',
          slug: 'author-two',
        },
        // Thêm các tác giả khác tương tự...
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('authors', null, {})
  },
}
