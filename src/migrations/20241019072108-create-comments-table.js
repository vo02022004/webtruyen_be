'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      chapter_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
      content: {
        type: Sequelize.TEXT,
        allowNull: true,
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
    await queryInterface.addConstraint('comments', {
      fields: ['user_id', 'chapter_id'],
      type: 'primary key',
      name: 'pk_comment', // Tên khóa chính
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('comments')
  },
}
