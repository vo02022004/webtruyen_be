'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
  class Author extends Model {
    static associate(models) {
      // Author.hasMany(models.Story, {
      //   foreignKey: 'story_id',
      //   constraints: false,
      // })
      Author.hasMany(models.Story, {
        as: 'stories',
        foreignKey: 'author_id',
        constraints: false,
      })
    }
  }
  Author.init(
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false,
        unique: true,
      },
      author_name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      description: {
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
      modelName: 'Author',
      table: 'authors',
      timestamps: false, // Thiết lập không sử dụng timestamps
    },
  )

  return Author
}
