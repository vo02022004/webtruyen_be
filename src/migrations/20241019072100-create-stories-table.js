// migrations/20241019000003-create-story.js
'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('stories', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      status: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      author_id: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      description: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      story_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      total_chapters: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      views: {
        type: Sequelize.INTEGER,
        defaultValue: 0,
      },
      cover: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      keywords: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      created_at: {
        type: Sequelize.DATE, // Thay đổi từ TIMESTAMP sang DATE
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updated_at: {
        type: Sequelize.DATE, // Thay đổi từ TIMESTAMP sang DATE
        defaultValue: Sequelize.literal(
          'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
        ),
      },
      slug: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('stories')
  },
}
