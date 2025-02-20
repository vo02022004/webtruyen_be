'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Story extends Model {
    static associate(models) {
      
      // Định nghĩa quan hệ ở đây nếu cần
      Story.belongsTo(models.Author, {
        as: 'author',
        foreignKey: 'author_id',
        constraints: false,
      })
      Story.hasMany(models.Chapter, {
        foreignKey: 'story_id',
        constraints: false,
      })
      Story.belongsToMany(models.Genre, {
        // through: 'genre_story',
        through: models.StoryGenre,
        foreignKey: 'story_id',
        otherKey: 'genre_id',
        as: 'genres', // Tùy chọn này có thể điều chỉnh tùy theo yêu cầu
      })
      Story.belongsToMany(models.Tag, {
        through: models.StoryTag,
        foreignKey: 'story_id',
        otherKey: 'tag_id',
        as: 'tags', // Tùy chọn này có thể điều chỉnh tùy theo yêu cầu
      })
      Story.hasMany(models.Review, {
        foreignKey: 'story_id',
        constraints: false,
      })
    }
  }

  Story.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      author_id: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      description: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      story_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      total_chapters: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      views: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
      },
      cover: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      keywords: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      slug: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      modelName: 'Story',
      tableName: 'stories', // Điều chỉnh nếu tên bảng khác
      timestamps: true,
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  )

  return Story
}