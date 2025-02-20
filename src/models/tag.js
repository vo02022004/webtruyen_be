'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    static associate(models) {
      // Định nghĩa quan hệ ở đây nếu cần
      Tag.belongsToMany(models.Story, {
        through: models.StoryTag,
        foreignKey: 'tag_id',
        otherKey: 'story_id',
        as: 'stories', // Tùy chọn này có thể điều chỉnh tùy theo yêu cầu
      })
    }
  }

  Tag.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      tag_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      tag_slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
    },
    {
      sequelize,
      modelName: 'Tag',
      tableName: 'tags',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  )

  return Tag
}

// const { Sequelize, DataTypes } = require('sequelize')
// const sequelize = require('@config/db_config.js')

// const Tag = sequelize.define(
//   'Tag',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     tag_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     tag_slug: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//   },
//   {
//     tableName: 'tags',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//   },
// )

// module.exports = Tag
