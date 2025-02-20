'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'roles',
      [
        {
          role_name: 'Admin',
          description: 'Quản trị viên',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          role_name: 'User',
          description: 'Người dùng',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('role', null, {})
  },
}
