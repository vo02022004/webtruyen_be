const express = require('express')
const {
  handleGetUsers,
  handleGetUserByID,
  handleCreateUser,
  handleDeleteUser,
  handleSearchUsers,
  handleUpdateUserByID: handleUpdateUser,
} = require('@controllers/user.controller')
const { uploadSingleFile } = require('../middlewares/upload.middleware')
const router = express.Router()
//===================
//User Create API Endpoints
//===================
router.post('/', uploadSingleFile('avatar'), handleCreateUser)

//===================
//User Read API Endpoints
//===================
// GET /users - Lấy danh sách tất cả người dùng
router.get('/', handleGetUsers)
// GET /users/search
router.get('/search', handleSearchUsers)
// GET /users/:id - Lấy thông tin chi tiết của một người dùng dựa trên ID
router.get('/:id', handleGetUserByID)
//===================
//User Update API Endpoints
//===================
router.patch('/:id', uploadSingleFile('avatar'), handleUpdateUser)
//===================
//User Delete API Endpoints
//===================
router.delete('/:id', handleDeleteUser)

module.exports = router
