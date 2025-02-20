const { User } = require('@models/')
const createHttpError = require('http-errors')
const message = require('@root/message.js')
const { JWT_SECRET } = process.env
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

//============================
// Authentication functions
//============================

/**LOGIN
 * @param {string} email - email người dùng
 */
async function findUserByEmail(email) {
  try {
    const user = await User.findOne({ where: { email: email } })
    if (!user) {
      throw createHttpError.NotFound(message.auth.emailNotFound)
    }
    return user
  } catch (error) {
    throw error
  }
}

/**
 * Xử lý logic đăng nhập người dùng
 * @param {string} username - Tên đăng nhập
 * @param {string} password - Mật khẩu
 * @returns {Object} - Kết quả đăng nhập (thành công hoặc thông báo lỗi)
 */
// async function loginUser(username, password) {
//   // Tìm người dùng theo username
//   const user = await User.findOne({ where: { username } })

//   if (!user) {
//     // Trả về lỗi nếu người dùng không tồn tại
//     return { success: false, message: 'Tên đăng nhập không tồn tại' }
//   }

//   // Kiểm tra mật khẩu
//   const isPasswordValid = await bcrypt.compare(password, user.password)
//   if (!isPasswordValid) {
//     // Trả về lỗi nếu mật khẩu không chính xác
//     return { success: false, message: 'Mật khẩu không chính xác' }
//   }

//   // Tạo JWT token
//   const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, {
//     expiresIn: '1h',
//   })

//   // Trả về thông tin đăng nhập thành công
//   return {
//     success: true,
//     message: 'Đăng nhập thành công',
//     data: {
//       userId: user.id,
//       username: user.username,
//       email: user.email,
//       token,
//     },
//   }
// }
/**
 * Đăng ký người dùng mới.
 * @param {Object} userData - Dữ liệu của người dùng (username, email, password, confirmPassword)
 * @returns {Promise<Object>} - Trả về thông tin người dùng hoặc lỗi
 */
// async function registerUser(userData) {
//   const { username, email, password, confirmPassword } = userData

//   if (username.length > 50) {
//     return { success: false, message: 'Tên đăng nhập không được quá 50 ký tự.' }
//   }
//   if (password.length > 50) {
//     return { success: false, message: 'Mật khẩu nhập không được quá 50 ký tự.' }
//   }

//   // Kiểm tra yêu cầu độ mạnh của mật khẩu
//   const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/
//   if (!password || !passwordRegex.test(password)) {
//     return {
//       success: false,
//       message: 'Mật khẩu không hợp lệ',
//     }
//   }

//   // Kiểm tra nếu người dùng đã tồn tại với username
//   const existingUsernameUser = await User.findOne({ where: { username } })
//   if (existingUsernameUser) {
//     return { success: false, message: 'Tên đăng nhập đã tồn tại' } // Không ném lỗi, mà trả về thông tin
//   }

//   // Kiểm tra nếu người dùng đã tồn tại với email
//   const existingEmailUser = await User.findOne({ where: { email } })
//   if (existingEmailUser) {
//     return { success: false, message: 'Email đã tồn tại' } // Không ném lỗi, mà trả về thông tin
//   }

//   // Kiểm tra nếu password và confirmPassword không khớp
//   if (password !== confirmPassword) {
//     return { success: false, message: 'Mật khẩu không khớp.' } // Trả về thông tin không ném lỗi
//   }

//   // Mã hóa mật khẩu trước khi lưu vào database
//   const salt = await bcrypt.genSalt(10)
//   const hashedPassword = await bcrypt.hash(password, salt)
//   console.log(hashedPassword)
//   // Tạo người dùng mới
//   try {
//     const newUser = await User.create({
//       username,
//       email,
//       password: hashedPassword,
//       role_id: 2,
//       status: 1,
//       avatar: 'default_avatar.png',
//     })

//     // Tạo JWT token
//     const token = jwt.sign(
//       { id: newUser.id, email: newUser.email },
//       JWT_SECRET,
//       {
//         expiresIn: '1h', // Token hết hạn sau 1 giờ
//       },
//     )

//     return {
//       success: true,
//       message: 'Đăng ký thành công!',
//       data: {
//         userId: newUser.id,
//         username: newUser.username,
//         email: newUser.email,
//         token,
//       },
//     }
//   } catch (error) {
//     return { success: false, message: message.auth.registrationfailed }
//   }
// }
/** USER REGISTER
 * Đăng ký người dùng mới.
 * @param {Object} user - Dữ liệu của người dùng (username, email, password)
 * @returns {Promise<Object>} - Trả về thông tin người dùng hoặc lỗi
 */
async function registerUser(user) {
  try {
    const { username, email, password } = user
    const roles = [1, 2]
    if (user.role_id && !roles.includes(Number(user.role_id))) {
      return 400, message.roles.invalid
    }
    return await User.create({
      username,
      email,
      password: password,
      role_id: 2,
      status: 1,
      avatar: 'default_avatar.png',
    })
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      throw createHttpError(
        400,
        error.errors.map((err) => err.message).join(', '),
      )
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      const uqField = error.errors[0].path
      if (uqField === 'email') {
        throw createHttpError(409, message.user.emailExisted)
      } else if (uqField === 'username') {
        throw createHttpError(409, message.user.usernameExisted)
      }
    } else {
      throw createHttpError(error.statusCode || 500, message.user.createFailed)
    }
  }
}

/** GET USER'S INFORMATION
 * Lấy thông tin người dùng
 * @param {number} id
 * @returns
 */
async function getProfile(id) {
  try {
    const user = await User.findByPk(id, {
      attributes: [
        'id',
        'username',
        'email',
        'role_id',
        'createdAt',
        'status',
        'avatar',
      ],
    })
    return user
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      throw createHttpError(
        400,
        error.errors.map((err) => err.message).join(', '),
      )
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      const uqField = error.errors[0].path
      if (uqField === 'email') {
        throw createHttpError(409, message.user.emailExisted)
      } else if (uqField === 'username') {
        throw createHttpError(409, message.user.usernameExisted)
      }
    } else {
      throw createHttpError(error.statusCode || 500, message.user.createFailed)
    }
  }
}

/**
 * Xác minh và cập nhật mật khẩu người dùng
 * @param {string} userId - ID người dùng
 * @param {string} currentPassword - Mật khẩu hiện tại
 * @param {string} newPassword - Mật khẩu mới
 */
async function updatePassword(userId, currentPassword, newPassword) {
  // 1. Lấy thông tin người dùng từ DB
  const user = await User.findByPk(userId)
  if (!user) {
    throw createHttpError.NotFound('Người dùng không tồn tại.')
  }

  // 2. Xác minh mật khẩu hiện tại
  const isPasswordCorrect = await user.isRightPassword(currentPassword)
  if (!isPasswordCorrect) {
    throw createHttpError.BadRequest(message.auth.passwordIncorrect)
  }

  // 3. Mã hóa mật khẩu mới
  user.password = newPassword
  await User.hashPassword(user)

  // 4. Lưu thông tin đã cập nhật
  await user.save()

  return {
    message: message.user.updateSuccess,
  }
}

module.exports = {
  registerUser,
  findUserByEmail,
  getProfile,
  updatePassword,
}
