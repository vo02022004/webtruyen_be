const { Role, User } = require('@models')
const path = require('path')
const createError = require('http-errors')
const message = require('@root/message')
const { where, or, Op } = require('sequelize')
const fs = require('fs')
const { error } = require('console')
// ==========================
// User CRUD Functions
// ==========================
// CREATE USER
/**
 * Tạo một người dùng mới.
 * @param {Object} user - Đối tượng chứa thông tin người dùng mới.
 * @returns {Promise<Object>} - Trả về đối tượng người dùng đã được tạo.
 */
async function createUser(user) {
  try {
    const roles = [1, 2]
    if (user.role_id && !roles.includes(Number(user.role_id))) {
      return createError(400, message.roles.invalid)
    }
    return await User.create(user)
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      throw createError(400, error.errors.map((err) => err.message).join(', '))
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      const uqField = error.errors[0].path
      if (uqField === 'email') {
        throw createError(409, message.user.emailExisted)
      } else if (uqField === 'username') {
        throw createError(409, message.user.usernameExisted)
      }
    } else {
      throw createError(error.statusCode || 500, message.user.createFailed)
    }
  }
}
// READ USER
/**
 * Lấy danh sách tất cả người dùng.
 * @returns {Promise<Array>} - Trả về danh sách người dùng.
 */
async function getUsers(
  sortBy = 'id',
  order = 'ASC',
  page = 1,
  limit = 10,
  offset = 1,
) {
  const total = await User.count()
  const data = await User.findAll({
    attributes: [
      'id',
      'avatar',
      'username',
      'email',
      'role_id',
      'status',
      'created_at',
    ],
    include: [
      {
        model: Role,
        attributes: ['id', 'role_name', 'description'],
      },
    ],
    order: [[sortBy, order]],
    limit: limit,
    offset: offset,
  })

  const pagination = {
    total: total,
    page: page,
    limit: limit,
    totalPages: Math.ceil(total / limit),
  }
  return { data, pagination }
}
/**
 * Tìm kiếm người dùng theo từ khóa
 * @param {string} keyword - Từ khóa tìm kiếm
 * @param {string} [sortBy='id'] - Trường sắp xếp
 * @param {string} [order='ASC'] - Thứ tự sắp xếp
 * @param {number} [page=1] - Số trang
 * @param {number} [limit=10] - Số lượng bản ghi trên mỗi trang
 * @returns {Promise<{data: Array, pagination: Object}>} - Dữ liệu người dùng và thông tin phân trang
 */
async function searchUsers(
  keyword,
  sortBy = 'id',
  order = 'ASC',
  page = 1,
  limit = 10,
  offset = 1,
) {
  const total = await User.count({
    where: {
      [Op.or]: [
        { username: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } },
      ],
    },
  })

  const data = await User.findAll({
    attributes: [
      'id',
      'avatar',
      'username',
      'email',
      'role_id',
      'status',
      'created_at',
    ],
    where: {
      [Op.or]: [
        { username: { [Op.like]: `%${keyword}%` } },
        { email: { [Op.like]: `%${keyword}%` } },
      ],
    },
    include: [
      {
        model: Role,
        attributes: ['id', 'role_name', 'description'],
      },
    ],
    order: [[sortBy, order]],
    limit: limit,
    offset: offset,
  })

  const pagination = {
    total: total,
    page: page,
    limit: limit,
    totalPages: Math.ceil(total / limit),
  }

  return { data, pagination }
}
/**
 * Lấy thông tin chi tiết của một người dùng theo ID.
 * @param {number} id - ID của người dùng cần lấy thông tin.
 * @returns {Promise<Object|null>} - Trả về đối tượng người dùng hoặc null nếu không tìm thấy.
 */
async function getUserByID(id, showPassword = false) {
  return await User.findByPk(id, {
    attributes: [
      'id',
      'avatar',
      'username',
      'email',
      'role_id',
      'status',
      'created_at',
      showPassword ? 'password' : '',
    ],
  })
}
// UPDATE USER
/**
 * Cập nhật thông tin người dùng.
 * @param {number} id - ID của người dùng cần cập nhật.
 * @param {Object} updatedData - Đối tượng chứa dữ liệu cập nhật.
 * @returns {Promise<Object>} - Trả về đối tượng người dùng đã được cập nhật.
 */
async function updateUser(id, updateData) {
  try {
    const roles = [1, 2]
    if (updateData.role_id && !roles.includes(Number(updateData.role_id))) {
      throw createError(400, 'role tao lao')
    }
    const currentUser = await User.findByPk(id)
    if (!currentUser) {
      return {
        error: createError(404, message.user.notFound),
      }
    }
    const isChanged = Object.keys(updateData).some(
      (key) => updateData[key] !== currentUser[key],
    )
    if (!isChanged) {
      return {
        message: message.generalErrors.NoUpdate,
      }
    }
    const [affectedCount] = await User.update(updateData, { where: { id } })

    if (affectedCount === 0) {
      return {
        message: message.generalErrors.NoUpdate,
      }
    }
    return await User.findByPk(id, {
      attributes: [
        'id',
        'avatar',
        'username',
        'email',
        'role_id',
        'status',
        'created_at',
      ],
      include: [
        {
          model: Role,
          attributes: ['id', 'role_name', 'description'],
        },
      ],
    })
  } catch (error) {
    if (error.name === 'SequelizeValidationError') {
      throw createError(400, error.errors.map((err) => err.message).join(', '))
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      const uqField = error.errors[0].path
      if (uqField === 'email') {
        throw createError(409, message.user.emailExisted)
      } else if (uqField === 'username') {
        throw createError(409, message.user.usernameExisted)
      }
    } else {
      console.log(error)
      throw createError(500, message.user.updateFailed)
    }
  }
}
// DELETE USER
/**
 * Xóa một người dùng theo ID.
 * @param {number} id - ID của người dùng cần xóa.
 * @returns {Promise<void>} - Không trả về giá trị.
 */
async function deleteUserById(id) {
  try {
    const user = await User.findByPk(id)
    if (!user) {
      return {
        error: createError(404, message.user.notFound),
      }
    }
    const avatarPath = user.avatar
    await user.destroy()
    if (avatarPath) {
      const fullPath = path.join(__dirname, '../uploads/images/', avatarPath)
      console.log(fullPath)
      fs.unlink(fullPath, (err) => {
        if (err) {
          console.error('Failed to delete avatar:', err)
        } else {
          console.log('Avatar deleted successfully')
        }
      })
    }
    return { success: true, message: 'User deleted successfully' }
  } catch (error) {
    // Kiểm tra lỗi khác và tạo ngoại lệ phù hợp
    if (error.name === 'SequelizeDatabaseError') {
      throw createError(400, 'Có lỗi với dữ liệu đầu vào') // Lỗi dữ liệu đầu vào
    }
    throw createError(500, error.message) // Lỗi máy chủ
  }
}
module.exports = {
  createUser,
  getUsers,
  getUserByID,
  updateUser,
  deleteUserById,
  searchUsers,
}
