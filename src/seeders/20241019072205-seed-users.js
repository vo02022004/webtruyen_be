'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'users',
      [
        {
          username: 'admin1',
          email: 'admin@example.com',
          password: 'password1',
          role_id: 1,
          avatar: 'avatar1.png',
          created_at: new Date(),
          updated_at: new Date(),
          status: true,
        },
        {
          username: 'user1',
          email: 'user1@example.com',
          password: 'password2',
          role_id: 2,
          avatar: 'avatar2.png',
          created_at: new Date(),
          updated_at: new Date(),
          status: true,
        },
        // Thêm các người dùng khác tương tự...
      ],
      {},
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('users', null, {})
  },
}
