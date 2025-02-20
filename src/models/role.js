'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static associate(models) {
      // Định nghĩa quan hệ với mô hình User
      Role.hasMany(models.User, {
        foreignKey: 'role_id',
        constraints: false,
      })
    }
  }

  Role.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      role_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    {
      sequelize,
      modelName: 'Role',
      tableName: 'role',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  )

  return Role
}

// const { Sequelize, DataTypes } = require('sequelize')
// const sequelize = require('@config/db_config.js')

// const Role = sequelize.define(
//   'Role',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     role_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     description: {
//       type: DataTypes.STRING,
//       allowNull: true,
//     },
//   },
//   {
//     tableName: 'role',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//   },
// )
// Role.associate = function (models) {
//   Role.hasMany(models.User, {
//     foreignKey: 'role_id',
//     constraints: false,
//   })
// }
// module.exports = Role
