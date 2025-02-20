'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('favorite_stories', {
      user_id: {
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
    })

    // Thêm ràng buộc khóa chính sau khi tạo bảng
    await queryInterface.addConstraint('favorite_stories', {
      fields: ['user_id', 'story_id'],
      type: 'primary key',
      name: 'pk_favorite_story', // Tên khóa chính
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('favorite_stories')
  },
}
