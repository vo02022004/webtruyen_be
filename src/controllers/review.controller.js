'use strict'
const createHttpError = require('http-errors')
const {
  createReview,
  getReviews,
  getReviewsByStoryId,
  getReviewsByUserId,
  updateReview,
  deleteReview,
  searchReviews,
} = require('@services/review.service')
const message = require('@root/message')
const { reviewValidate } = require('@helper/validation')
// ================================================
//              Review Handler Functions
// ================================================
/**
 * Xử lý tạo đánh giá
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Đối tượng phản hồi HTTP
 * @param {Function} next - Hàm gọi tiếp theo
 */
async function handleCreateReview(req, res, next) {
  const { user_id, story_id, star, comment } = req.body

  const { error } = reviewValidate(req.body)
  if (error) {
    return next(createHttpError(400, error.details[0].message))
  }

  try {
    const newReview = await createReview({ user_id, story_id, star, comment })
    return res.status(201).json({
      success: true,
      status: 201,
      message: message.review.createSuccess,
      data: newReview,
      links: [],
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Xử lý lấy tất cả đánh giá
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Đối tượng phản hồi HTTP
 * @param {Function} next - Hàm gọi tiếp theo
 */
async function handleGetAllReviews(req, res, next) {
  try {
    const sortBy = req.query.sortBy || 'created_at'
    const order = req.query.order || 'DESC'
    const { data, pagination } = await getReviews(sortBy, order)
    return res.status(200).json({
      success: true,
      status: 200,
      message: message.review.fetchSuccess,
      data,
      pagination,
      links: [],
    })
  } catch (error) {
    next(error)
  }
}
/**
 * Xử lý lấy tất cả đánh giá
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Đối tượng phản hồi HTTP
 * @param {Function} next - Hàm gọi tiếp theo
 */
async function handleSearchReviews(req, res, next) {
  try {
    const sortBy = req.query.sortBy || 'created_at'
    const order = req.query.order || 'DESC'
    const keyword = req.query.keyword || ''
    const { data, pagination } = await searchReviews(keyword, sortBy, order)
    return res.status(200).json({
      success: true,
      status: 200,
      message: message.review.fetchSuccess,
      data,
      pagination,
      links: [],
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Xử lý lấy đánh giá theo ID truyện
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Đối tượng phản hồi HTTP
 * @param {Function} next - Hàm gọi tiếp theo
 */
async function handleGetReviewsByStoryId(req, res, next) {
  const { storyId } = req.params
  try {
    const { data, pagination } = await getReviewsByStoryId(storyId)
    return res.status(200).json({
      success: true,
      status: 200,
      message: message.review.fetchSuccess,
      data,
      pagination,
      links: [],
    })
  } catch (error) {
    next(error)
  }
}
/**
 * Xử lý lấy đánh giá theo user_id
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Đối tượng phản hồi HTTP
 * @param {Function} next - Hàm gọi tiếp theo
 */
async function handleGetReviewsByUserId(req, res, next) {
  const { user_id } = req.params
  try {
    const { data, pagination } = await getReviewsByUserId(user_id)
    return res.status(200).json({
      success: true,
      message: message.review.fetchSuccess,
      data,
      pagination,
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Xử lý cập nhật đánh giá theo ID
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Đối tượng phản hồi HTTP
 * @param {Function} next - Hàm gọi tiếp theo
 */
async function handleUpdateReview(req, res, next) {
  const { user_id, story_id } = req.params
  const { star, comment } = req.body

  const { error } = reviewValidate({ user_id, story_id, star, comment })
  if (error) {
    return next(createHttpError(400, error.details[0].message))
  }

  try {
    const updatedReview = await updateReview(user_id, story_id, {
      star,
      comment,
    })
    return res.status(200).json({
      success: true,
      status: 200,
      message: message.review.updateSuccess,
      data: updatedReview,
      links: [],
    })
  } catch (error) {
    next(error)
  }
}

/**
 * Xử lý xóa đánh giá theo user_id và story_id
 * @param {Object} req - Yêu cầu HTTP
 * @param {Object} res - Đối tượng phản hồi HTTP
 * @param {Function} next - Hàm gọi tiếp theo
 */
async function handleDeleteReview(req, res, next) {
  const { user_id, story_id } = req.params
  try {
    const deleted = await deleteReview(user_id, story_id)
    return res.status(200).json({
      success: true,
      status: 200,
      message: message.review.deleteSuccess,
      links: [],
    })
  } catch (error) {
    next(error)
  }
}

module.exports = {
  handleCreateReview,
  handleGetAllReviews,
  handleGetReviewsByStoryId,
  handleUpdateReview,
  handleDeleteReview,
  handleGetReviewsByUserId,
  handleSearchReviews,
}
