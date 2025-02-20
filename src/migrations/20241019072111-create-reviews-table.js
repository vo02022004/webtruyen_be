'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reviews', {
      user_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true, 
      },
      story_id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey:true, 
      },
      star: {
        type: Sequelize.INTEGER,
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
      comment: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
    })

    // Thêm ràng buộc khóa chính sau khi tạo bảng
    await queryInterface.addConstraint('reviews', {
      fields: ['user_id', 'story_id'],
      type: 'primary key',
      name: 'pk_review', // Tên khóa chính
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('reviews')
  },
}
