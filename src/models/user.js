'use strict'
const { Model, Sequelize } = require('sequelize')
const bcrypt = require('bcrypt')
const SALT_ROUNDS = 10

module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate(models) {
      User.belongsTo(models.Role, {
        foreignKey: 'role_id',
        constraints: false,
      })
      User.hasMany(models.Review, {
        foreignKey: 'user_id',
        constraints: false,
      })
    }
    // Phương thức kiểm tra mật khẩu
    async isRightPassword(password) {
      return bcrypt.compare(password, this.password)
    }
    // Phuwong thức mã hóa mật khẩu
    static async hashPassword(user) {
      const salt = await bcrypt.genSalt(SALT_ROUNDS)
      user.password = await bcrypt.hash(user.password, salt)
      // return user.password
    }
  }

  User.init(
    {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      createdAt: {
        field: 'created_at',
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        field: 'updated_at',
        type: DataTypes.DATE,
        defaultValue: Sequelize.NOW,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate: User.hashPassword, // Sử dụng hook trước khi tạo
      },
    },
  )

  return User
}
// const { Sequelize, DataTypes } = require('sequelize')
// const sequelize = require('@config/db_config.js')
// const bcrypt = require('bcrypt')
// const SALT_ROUNDS = 10
// const User = sequelize.define(
//   'User',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     username: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     email: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },

//     password: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },

//     role_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },

//     createdAt: {
//       field: 'created_at',
//       type: DataTypes.DATE,
//       defaultValue: Sequelize.NOW,
//     },
//     updatedAt: {
//       field: 'updated_at',
//       type: DataTypes.DATE,
//       defaultValue: Sequelize.NOW,
//     },

//     status: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//     },
//     avatar: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//   },
//   {
//     hooks: {
//       // Hash password before saving a new user
//       beforeCreate: async (user) => {
//         const salt = await bcrypt.genSalt(SALT_ROUNDS)
//         user.password = await bcrypt.hash(user.password, salt)
//       },
//     },
//     // Other model options go here
//   },
// )
// User.prototype.isRightPassword = async function (password) {
//   return bcrypt.compare(password, this.password)
// }
// User.associate = function (models) {
//   User.belongsTo(models.Role, {
//     foreignKey: 'role_id',
//     constraints: false,
//   })
// }

// module.exports = User
