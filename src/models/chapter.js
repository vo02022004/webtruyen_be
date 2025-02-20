'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Chapter extends Model {
    static associate(models) {
      // Định nghĩa quan hệ ở đây nếu cần
      Chapter.belongsTo(models.Story, {
        foreignKey: 'story_id',
        constraints: false,
      })
    }
  }

  Chapter.init(
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      chapter_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      story_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      views: {
        type: DataTypes.INTEGER,
        allowNull: true,
      },
      status: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
      },
      chapter_order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        unique: true,
      },
      published_at: { 
        type: DataTypes.DATE, 
        allowNull: true,
      }
    },
    {
      sequelize,
      modelName: 'Chapter',
      tableName: 'chapters',
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  )

  return Chapter
}

// const { Sequelize, DataTypes } = require('sequelize')
// const sequelize = require('@config/db_config.js')

// const Chapter = sequelize.define(
//   'Chapter',
//   {
//     id: {
//       type: DataTypes.INTEGER,
//       primaryKey: true,
//       autoIncrement: true,
//     },
//     chapter_name: {
//       type: DataTypes.STRING,
//       allowNull: false,
//     },
//     content: {
//       type: DataTypes.TEXT,
//       allowNull: false,
//     },
//     story_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//     slug: {
//       type: DataTypes.STRING,
//       allowNull: false,
//       unique: true,
//     },
//     views: {
//       type: DataTypes.INTEGER,
//       allowNull: true,
//     },
//     status: {
//       type: DataTypes.BOOLEAN,
//       allowNull: false,
//     },
//     chapter_order: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//   },
//   {
//     tableName: 'chapters',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//   },
// )

// module.exports = Chapter
