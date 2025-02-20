const { Sequelize } = require('sequelize')
const http = require('http-errors')
const message = require('@root/message.js')
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASS,
  {
    host: 'localhost',
    dialect: 'mysql',
  },
)

const config_db = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connection has been established successfully.')
    // Tạo bảng, force: true sẽ xóa bảng cũ và tạo lại
    // await sequelize.sync({ force: true })
  } catch (error) {
    // throw new Error(http.InternalServerError(message.generalErrors.serverError))
    console.log(http.InternalServerError(message.generalErrors.serverError))
  }
}
config_db()
module.exports = sequelize
