const createHttpError = require('http-errors')
const {
  createUser,
  getUsers,
  getUserByID,
  updateUser,
  deleteUserById,
  searchUsers,
} = require('@services/user.service')
const message = require('@root/message')
const { userValidate } = require('@helper/validation')
const upload = require('../middlewares/upload.middleware')
// ================================================
//              User Handler Functions
// ================================================
//   CREATE USER
/**
 * Xử lý yêu cầu tạo một người dùng mới.
 * @param {Object} req - Đối tượng yêu cầu.
 * @param {Object} res - Đối tượng phản hồi.
 * @param {Function} next - Hàm gọi tiếp theo trong middleware.
 */
async function handleCreateUser(req, res, next) {
  //lấy tên file được gửi lên
  const uploadedFile = req.file
  const avatar = uploadedFile ? uploadedFile.filename : null

  //lấy dữ liệu từ form
  const { username, email, password, confirmPassword, role_id, status } =
    req.body

  //xác thực đầu vào
  const { error } = userValidate({
    username: username,
    email: email,
    password: password,
    confirmPassword: confirmPassword,
    role_id: role_id,
    status: status,
    avatar: avatar,
  })

  if (error) {
    return next(error)
  }

  //tạo người dùng mới
  try {
    const newUser = await createUser({
      username,
      email,
      password,
      role_id,
      status,
      avatar,
    })

    return res.status(201).json({
      success: true,
      status: 201,
      message: message.user.createSucess,
      data: newUser,
      links: [],
    })
  } catch (error) {
    next(error)
  }
}
/**
 * Xử lý yêu cầu phân trang
 * @param {Object} req - Đối tượng yêu cầu.
 *
 */
function getPagination(req) {
  try {
    const page = parseInt(req.query.page) || 1
    const limit = parseInt(req.query.limit) || 10
    const offset = (page - 1) * limit
    return { page, limit, offset }
  } catch (error) {
    throw createHttpError(404, message.generalErrors.invalidDataQuery)
  }
}
// READ USER
/**
 * Xử lý yêu cầu lấy danh sách tất cả người dùng. lấy theo trang
 * khi người dùng không điền thì mặc định lấy trang 1 và 10 records
 * @param {Object} req - Đối tượng yêu cầu.
 * @param {Object} res - Đối tượng phản hồi.
 * @param {Function} next - Hàm gọi tiếp theo trong middleware.
 * @returns {Promise<void>} - Không trả về giá trị.
 */
async function handleGetUsers(req, res, next) {
  try {
    //============= Khai báo biến, lấy thông tin req =============//
    // Lấy các thông tin về phân trang
    const { page, limit, offset } = getPagination(req)
    // Các trường hợp sắp xếp hợp lệ
    const validSortFields = [
      'id',
      'username',
      'email',
      'status',
      'role_id',
      'createdAt',
    ]
    // Các thứ tự hợp lệ
    const validOrderValues = ['ASC', 'DESC']
    const sortBy = req.query.sortBy || 'id'
    const order = req.query.order || 'DESC'

    //============= Kiểm tra dữ liệu có hợp lệ không ============//
    // Kiểm tra xem sortBy có hợp lệ không
    if (!validSortFields.includes(sortBy)) {
      const err = new Error(message.generalErrors.invalidDataQuery)
      err.status = 400
      throw err
    }
    // Kiểm tra xem order có hợp lệ không
    if (!validOrderValues.includes(order.toUpperCase())) {
      const err = new Error(message.generalErrors.invalidDataQuery)
      err.status = 400
      throw err
    }

    //============== Trả về dữ liệu =============================//
    let { data, pagination } = await getUsers(
      sortBy,
      order,
      page,
      limit,
      offset,
    )
    console.log(data)
    return res.status(200).json({
      success: true,
      message: message.user.fetchSucess,
      data: data,
      pagination: pagination,
      links: [],
    })
  } catch (error) {
    console.log(error.message)
    next(error)
  }
}

/**
 * Xử lý yêu cầu lấy thông tin chi tiết của người dùng theo ID.
 * @param {Object} req - Đối tượng yêu cầu.
 * @param {Object} res - Đối tượng phản hồi.
 * @param {Function} next - Hàm gọi tiếp theo trong middleware.
 * @returns {Promise<void>} - Không trả về giá trị.
 */
async function handleGetUserByID(req, res, next) {
  try {
    const id = req.params.id
    let data = await getUserByID(id)
    // Kiểm tra xem người dùng có tồn tại không
    if (!data) {
      next(createHttpError(404, message.user.notFound))
    }

    return res.status(200).json({
      success: true,
      message: message.user.fetchSucess,
      data: data,
      links: [],
    })
  } catch (error) {
    next(error)
  }
}

async function handleSearchUsers(req, res, next) {
  try {
    const keyword = req.query.keyword || ''
    const sortBy = req.query.sortBy || 'id'
    const order = req.query.order || 'DESC'
    const { page, limit, offset } = getPagination(req)
    const { data, pagination } = await searchUsers(
      keyword,
      sortBy,
      order,
      page,
      limit,
      offset,
    )

    return res.status(200).json({
      success: true,
      message: message.generalErrors.findSuccess,
      data: data,
      pagination: pagination,
    })
  } catch (error) {
    console.error(error.message)
    next(error)
  }
}

/**
 * Xử lý yêu cầu lấy thông tin chi tiết của người dùng theo ID.
 * @param {Object} req - Đối tượng yêu cầu.
 * @param {Object} res - Đối tượng phản hồi.
 * @param {Function} next - Hàm gọi tiếp theo trong middleware.
 * @returns {Promise<void>} - Không trả về giá trị.
 */
async function handleUpdateUserByID(req, res, next) {
  try {
    //lấy tên file được gửi lên
    const id = req.params.id
    const { username, email, role_id, status, avatar } = req.body
    const uploadedFile = req.file
    const newAvatar = uploadedFile ? uploadedFile.filename : avatar
    console.log(uploadedFile)
    console.log(newAvatar)
    //xác thực đầu vào
    const { error } = userValidate(
      {
        username: username,
        email: email,
        role_id: role_id,
        status: status,
        avatar: newAvatar,
      },
      true,
    )

    if (error) {
      return next(error)
    }
    const result = await updateUser(id, {
      username: username,
      email: email,
      role_id: role_id,
      status: status,
      avatar: newAvatar,
    })
    if (result.error) {
      next(result.error)
    }
    if (result.message) {
      console.log(result.message)
      return res.status(200).json({
        success: false,
        status: 200,
        message: result.message,
        data: null,
        links: [],
      })
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: message.user.updateSuccess,
      data: result,
      links: [],
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Xử lý yêu cầu xóa người dùng theo ID.
 * @param {Object} req - Đối tượng yêu cầu.
 * @param {Object} res - Đối tượng phản hồi.
 * @param {Function} next - Hàm gọi tiếp theo trong middleware.
 * @returns {Promise<void>} - Không trả về giá trị.
 */
async function handleDeleteUser(req, res, next) {
  const id = req.params.id
  try {
    const result = await deleteUserById(id)
    if (result.error) {
      return next(result.error) // Gọi middleware xử lý lỗi với lỗi 404
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: message.user.deleteSuccess,
      data: [],
      links: [],
    })
  } catch (error) {
    return next(error)
  }
}

module.exports = {
  handleGetUsers,
  handleGetUserByID,
  handleCreateUser,
  handleDeleteUser,
  handleUpdateUserByID,
  handleSearchUsers,
}
