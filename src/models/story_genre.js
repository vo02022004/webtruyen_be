'use strict'
const { Model } = require('sequelize')

module.exports = (sequelize, DataTypes) => {
    class StoryGenre extends Model {
        static associate(models) {
            // Định nghĩa quan hệ ở đây nếu cần
            StoryGenre.belongsTo(models.Story, {
                foreignKey: 'story_id',
                as: 'story', // Tùy chọn này có thể điều chỉnh tùy theo yêu cầu
            })
            StoryGenre.belongsTo(models.Genre, {
                foreignKey: 'genre_id',
                as: 'genre', // Tùy chọn này có thể điều chỉnh tùy theo yêu cầu
            })
        }
    }

    StoryGenre.init(
        {
            story_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
            genre_id: {
                type: DataTypes.INTEGER,
                allowNull: false,
            },
        },
        {
            sequelize,
            modelName: 'StoryGenre',
            tableName: 'genre_story',
            timestamps: true,
            createdAt: 'created_at',
            updatedAt: 'updated_at',
        },
    )

    return StoryGenre
}

// const { Sequelize, DataTypes } = require('sequelize')
// const sequelize = require('@config/db_config.js')

// const StoryGenre = sequelize.define(
//   'StoryGenre',
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
//     genre_id: {
//       type: DataTypes.INTEGER,
//       allowNull: false,
//     },
//   },
//   {
//     tableName: 'story_genres',
//     timestamps: true,
//     createdAt: 'created_at',
//     updatedAt: 'updated_at',
//   },
// )

// module.exports = StoryGenre
