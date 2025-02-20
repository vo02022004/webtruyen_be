//======================================
//           Require modules
//======================================
require('dotenv').config()
require('module-alias/register')

const createError = require('http-errors')
const message = require('@root/message.js')
const cors = require('cors')
const express = require('express')
const config = require('./src/config/sys.config.js')
const db = require('@models')
const { verifyAccessToken } = require('./src/middlewares/auth.middleware.js')
const app = express()

//======================================
//            Import routers
//======================================

const authRouter = require('./src/routes/auth.router.js')
const userRouter = require('./src/routes/user.router.js')
const authorRouter = require('./src/routes/author.router.js')
const storyRouter = require('./src/routes/stories.router.js')
const chapterRouter = require('./src/routes/chapter.router.js')
const reviewRouter = require('./src/routes/review.router.js')
const genreStoriesRouter = require('./src/routes/genreStorie.router.js')
const genreRouter = require('./src/routes/genre.router.js')
const ratings = require('./src/routes/authreview.router.js')

//======================================
//Configuration: static files,
//    JSON parsing, and urlencoded
//======================================
config(app, express)
app.use(cors({ credentials: true, origin: true }))

//=======================================
//        Middleware & router
//=======================================
//ROUTERS
// Uncomment if needed: app.use(verifyAccessToken)
app.use('/api/auth', authRouter)
// app.use(verifyAccessToken)
app.use('/api/genres', genreRouter)
app.use('/api/story/', storyRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/chapters', chapterRouter)
app.use('/api/users', userRouter)
app.use('/api/authors', authorRouter)
app.use('/api/stories', storyRouter)
app.use('/api/reviews', reviewRouter)
app.use('/api/story-genre', genreStoriesRouter)
app.use('/api/ratings', ratings)

//MIDDLEWARE
// Middleware: error handler for 404
app.use((req, res, next) => {
  next(createError(404, message.generalErrors.notFound))
})

// Middleware: generic error handler
app.use((err, req, res, next) => {
  console.log(err)
  res.status(err.statusCode || 500).json({
    success: false,
    status: err.statusCode || 500,
    message: err.message || message.generalErrors.serverError,
  })
})
//======================================
//           Start server
//======================================
const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
