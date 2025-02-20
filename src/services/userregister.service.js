const bcrypt = require('bcryptjs') // Để mã hóa mật khẩu
const jwt = require('jsonwebtoken') // Để tạo token cho user
const { User } = require('../models/') // Import model User
const createError = require('http-errors')
const message = require('@root/message')
const { JWT_SECRET } = process.env // Sử dụng biến môi trường chứa JWT secret

// ==========================
// User Registration Service
// ==========================

/**
 * Đăng ký người dùng mới.
 * @param {Object} userData - Dữ liệu của người dùng (username, email, password, confirmPassword)
 * @returns {Promise<Object>} - Trả về thông tin người dùng hoặc lỗi
 */
async function registerUser(userData) {
  const { username, email, password, confirmPassword } = userData

  if (username.length > 50) {
    return { success: false, message: 'Tên đăng nhập không được quá 50 ký tự.' }
  }
  if (password.length > 50) {
    return { success: false, message: 'Mật khẩu nhập không được quá 50 ký tự.' }
  }

  // Kiểm tra yêu cầu độ mạnh của mật khẩu
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
  if (!password || !passwordRegex.test(password)) {
    return {
      success: false,
      message: 'Mật khẩu không hợp lệ',
    }
  }

  // Kiểm tra nếu người dùng đã tồn tại với username
  const existingUsernameUser = await User.findOne({ where: { username } })
  if (existingUsernameUser) {
    return { success: false, message: 'Tên đăng nhập đã tồn tại' } // Không ném lỗi, mà trả về thông tin
  }

  // Kiểm tra nếu người dùng đã tồn tại với email
  const existingEmailUser = await User.findOne({ where: { email } })
  if (existingEmailUser) {
    return { success: false, message: 'Email đã tồn tại' } // Không ném lỗi, mà trả về thông tin
  }

  // Kiểm tra nếu password và confirmPassword không khớp
  if (password !== confirmPassword) {
    return { success: false, message: 'Mật khẩu không khớp.' } // Trả về thông tin không ném lỗi
  }

  // Mã hóa mật khẩu trước khi lưu vào database
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  console.log(hashedPassword)
  // Tạo người dùng mới
  try {
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role_id: 2,
      status: 1,
      avatar: 'default_avatar.png',
    })

    // Tạo JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      {
        expiresIn: '1h', // Token hết hạn sau 1 giờ
      },
    )

    return {
      success: true,
      message: 'Đăng ký thành công!',
      data: {
        userId: newUser.id,
        username: newUser.username,
        email: newUser.email,
        token,
      },
    }
  } catch (error) {
    return { success: false, message: message.auth.registrationfailed } // Trả về lỗi chung nếu có lỗi khi tạo người dùng
  }
}

module.exports = {
  registerUser,
}
