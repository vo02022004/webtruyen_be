'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class FavoriteStory extends Model {
    static associate(models) {
      // Định nghĩa quan hệ ở đây nếu cần
      FavoriteStory.belongsTo(models.User, {
        foreignKey: 'user_id',
        as: 'user', // Tùy chọn này có thể điều chỉnh tùy theo yêu cầu
      })
      FavoriteStory.belongsTo(models.Story, {
        foreignKey: 'story_id',
        as: 'story', // Tùy chọn này có thể điều chỉnh tùy theo yêu cầu
      })
    }
  }

  FavoriteStory.init(
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
      story_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'FavoriteStory',
      tableName: 'favorite_stories',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  )

  return FavoriteStory
}

// const { Sequelize, DataTypes } = require('sequelize')
// const sequelize = require('@config/db_config.js')

// const FavoriteStory = sequelize.define(
//   'FavoriteStory',
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
//     story_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//   },
//   {
//     tableName: 'favorite_stories',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//   },
// )

// module.exports = FavoriteStory
