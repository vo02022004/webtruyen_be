'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class StoryTag extends Model {
    static associate(models) {
      // Định nghĩa quan hệ ở đây nếu cần
      StoryTag.belongsTo(models.Story, {
        foreignKey: 'story_id',
        as: 'story', // Tùy chọn này có thể điều chỉnh tùy theo yêu cầu
      })
      StoryTag.belongsTo(models.Tag, {
        foreignKey: 'tag_id',
        as: 'tag', // Tùy chọn này có thể điều chỉnh tùy theo yêu cầu
      })
    }
  }

  StoryTag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      story_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      tag_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'StoryTag',
      tableName: 'story_tags',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  )

  return StoryTag
}

// const { Sequelize, DataTypes } = require('sequelize')
// const sequelize = require('@config/db_config.js')

// const StoryTag = sequelize.define(
//   'StoryTag',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     story_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     tag_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//   },
//   {
//     tableName: 'story_tags',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//   },
// )

// module.exports = StoryTag
