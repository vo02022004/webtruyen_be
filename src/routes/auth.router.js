const express = require('express')
const { verifyAccessToken } = require('@middlewares/auth.middleware')
const authRouter = express.Router()
const {
  handleLogin,
  handleRefreshToken,
  handleLoginUser,
  handleRegister,
  handleGetProfile,
  handleUpdateAvatar,
  handleUpdatePassword,
} = require('@controllers/auth.controller.js')
const { uploadSingleFile } = require('../middlewares/upload.middleware')

//=============== Authentication ===================//

//Get profile information
authRouter.get('/me', verifyAccessToken, handleGetProfile)

//update avatar
authRouter.patch(
  '/me/avatar',
  verifyAccessToken,
  uploadSingleFile('avatar'),
  handleUpdateAvatar,
)
//update password
authRouter.patch('/me/password', verifyAccessToken, handleUpdatePassword)
//sign in for admin, user
authRouter.post('/login', handleLogin)

//sign in for user
//=========================
// authRouter.post('/', handleLoginUser)

//========================
//sign up for user
//========================
authRouter.post('/register', handleRegister)

//fresh token
authRouter.post('/refresh-token', handleRefreshToken)

module.exports = authRouter
