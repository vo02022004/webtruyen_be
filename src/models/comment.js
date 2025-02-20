'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate(models) {
      // Định nghĩa quan hệ ở đây nếu cần
      Comment.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user', // Tùy chọn này có thể điều chỉnh tùy theo yêu cầu
      })
      Comment.belongsTo(models.Chapter, {
        foreignKey: 'chapter_id',
        as: 'chapter', // Tùy chọn này có thể điều chỉnh tùy theo yêu cầu
      })
    }
  }

  Comment.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      user_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      chapter_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Comment',
      tableName: 'comments',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  )

  return Comment
}

// const { Sequelize, DataTypes } = require('sequelize')
// const sequelize = require('@config/db_config.js')

// const Comment = sequelize.define(
//   'Comment',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     user_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     chapter_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//   },
//   {
//     tableName: 'comments',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//   },
// )

// module.exports = Comment
