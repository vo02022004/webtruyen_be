'use strict'
const createHttpError = require('http-errors')
const {
  createReview,
  getReviewsByUserId,
  updateReview,
  deleteReview,
} = require('@services/authreview.service')
const message = require('@root/message')
const { reviewValidate } = require('@helper/validation')

// ================================================
//         User Review Handler Functions
// ================================================

/**
 * Xử lý tạo đánh giá của người dùng
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Đối tượng phản hồi HTTP
 * @param {Function} next - Hàm gọi tiếp theo
 */
async function handleCreateUserReview(req, res, next) {
  const {user_id, story_id, star, comment } = req.body
//   const user_id = req.user.id // Lấy từ token hoặc session đăng nhập

  const { error } = reviewValidate({ user_id, story_id, star, comment })
  if (error) {
    return next(createHttpError(400, error.details[0].message))
  }
  try {
    const newReview = await createReview({ user_id, story_id, star, comment })
    return res.status(201).json({
      success: true,
      status: 201,
      message: message.authreview.createSuccess,
      data: newReview,
      links: [],
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Lấy danh sách đánh giá của người dùng
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Đối tượng phản hồi HTTP
 * @param {Function} next - Hàm gọi tiếp theo
 */
async function handleGetUserReviews(req, res, next) {
//   const user_id = req.user.id // Lấy từ token hoặc session đăng nhập

  try {
    const reviews = await getReviewsByUserId(user_id)
    return res.status(200).json({
      success: true,
      status: 200,
      message: message.authreview.getSuccess,
      data: reviews,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Cập nhật đánh giá của người dùng
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Đối tượng phản hồi HTTP
 * @param {Function} next - Hàm gọi tiếp theo
 */
async function handleUpdateUserReview(req, res, next) {
  // const { user_id, story_id } = req.params
  const { user_id, story_id, star, comment } = req.body
//   const user_id = req.user.id // Lấy từ token hoặc session đăng nhập
  try {
    const updatedReview = await updateReview({ user_id, story_id, star, comment })
    return res.status(200).json({
      success: true,
      status: 200,
      message: message.authreview.updateSuccess,
      data: updatedReview,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Xóa đánh giá của người dùng
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Đối tượng phản hồi HTTP
 * @param {Function} next - Hàm gọi tiếp theo
 */
async function handleDeleteUserReview(req, res, next) {
  const {user_id, story_id } = req.params
//   const user_id = req.user.id // Lấy từ token hoặc session đăng nhập

  try {
    await deleteReview({ story_id, user_id })
    return res.status(200).json({
      success: true,
      status: 200,
      message: message.authreview.deleteSuccess,
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  handleCreateUserReview,
  handleGetUserReviews,
  handleUpdateUserReview,
  handleDeleteUserReview,
}
