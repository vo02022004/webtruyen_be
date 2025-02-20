'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('genre_story', {
      genre_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      story_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      created_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
      },
    })

    // Thêm ràng buộc khóa chính sau khi tạo bảng
    await queryInterface.addConstraint('genre_story', {
      fields: ['genre_id', 'story_id'],
      type: 'primary key',
      name: 'pk_genre_story', // Tên khóa chính
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('genre_story')
  },
}
