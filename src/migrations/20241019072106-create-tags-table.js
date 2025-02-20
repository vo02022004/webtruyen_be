'use strict'

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('tags', {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      tag_name: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
      tag_slug: {
        type: Sequelize.STRING(255),
        allowNull: true,
      },
    })
  },

  async down(queryInterface) {
    await queryInterface.dropTable('tags')
  },
}
