'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tag_story', {
      tag_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      story_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    })

    // Thêm ràng buộc khóa chính sau khi tạo bảng
    await queryInterface.addConstraint('tag_story', {
      fields: ['tag_id', 'story_id'],
      type: 'primary key',
      name: 'pk_tag_story', // Tên khóa chính
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tag_story')
  },
}
