// services/user.service.js
const { User } = require('../models/')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const { JWT_SECRET } = process.env

/**
 * Xử lý logic đăng nhập người dùng
 * @param {string} username - Tên đăng nhập
 * @param {string} password - Mật khẩu
 * @returns {Object} - Kết quả đăng nhập (thành công hoặc thông báo lỗi)
 */
async function loginUser(username, password) {
  // Tìm người dùng theo username
  const user = await User.findOne({ where: { username } })
  const a = true
  if (!user) {
    // Trả về lỗi nếu người dùng không tồn tại
    return { success: false, message: 'Tên đăng nhập không tồn tại' }
  }

  // Kiểm tra mật khẩu
  const isPasswordValid = await bcrypt.compare(password, user.password)
  if (!isPasswordValid) {
    // Trả về lỗi nếu mật khẩu không chính xác
    return { success: false, message: 'Mật khẩu không chính xác' }
  }

  // Tạo JWT token
  const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
    expiresIn: '1h',
  })

  // Trả về thông tin đăng nhập thành công
  return {
    success: true,
    message: 'Đăng nhập thành công',
    data: {
      userId: user.id,
      username: user.username,
      email: user.email,
      token,
    },
  }
}

module.exports = { loginUser }
