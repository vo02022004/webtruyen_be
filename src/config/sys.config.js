const path = require('path')
const config = (app, express) => {
  app.use(express.static(path.join(path.resolve(), 'src/public')))
  app.use(express.static(path.join(path.resolve(), 'src/uploads/images')))
  app.use(express.json())
  app.use(express.urlencoded({ extended: true }))
}

module.exports = config
