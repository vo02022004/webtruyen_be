const { Review, User, Story } = require('@models')
const createError = require('http-errors')
const message = require('@root/message')
const { Op } = require('sequelize')

// ==========================
// Review CRUD Functions
// ==========================

// CREATE REVIEW
/**
 * Tạo một đánh giá mới.
 * @param {Object} review - Đối tượng chứa thông tin đánh giá mới.
 * @returns {Promise<Object>} - Trả về đối tượng đánh giá đã được tạo.
 */
async function createReview(review) {
  try {
    const storyExists = await Story.findByPk(review.story_id)
    if (!storyExists) {
      throw createError[404](message.review.storyNotFound)
    }

    const userExists = await User.findByPk(review.user_id)
    if (!userExists) {
      throw createError(404, message.user.notFound)
    }

    return await Review.create(review)
  } catch (error) {
    console.log(error)
    if (error.name === 'SequelizeValidationError') {
      throw createError(400, error.errors.map((err) => err.message).join(', '))
    } else if (error.name === 'SequelizeUniqueConstraintError') {
      throw createError(409, error.errors.map((err) => err.message).join(', '))
    } else if (error.status == 404) {
      throw createError(404, error.message)
    } else {
      throw createError(500, message.review.createFailed)
    }
  }
}

// READ REVIEWS
/**
 * Lấy danh sách tất cả đánh giá.
 * @returns {Promise<Array>} - Trả về danh sách đánh giá.
 */

async function getReviews(
  sortBy = 'created_at',
  order = 'DESC',
  page = 1,
  limit = 10,
) {
  const offset = (page - 1) * limit
  const total = await Review.count()

  const orderClause = (() => {
    if (sortBy === 'username') {
      return [{ model: User }, 'username', order]
    } else if (sortBy === 'story_name') {
      return [{ model: Story }, 'story_name', order]
    } else {
      return [sortBy, order]
    }
  })()

  const data = await Review.findAll({
    order: [orderClause],
    limit: limit,
    offset: offset,
    include: [
      {
        model: User,
        attributes: ['id', 'username'],
      },
      {
        model: Story,
        attributes: ['id', 'story_name'],
      },
    ],
  })

  const pagination = {
    total: total,
    page: page,
    limit: limit,
    totalPages: Math.ceil(total / limit),
  }

  return { data, pagination }
}

// GET REVIEWS BY STORY ID
/**
 * Lấy danh sách đánh giá của một câu chuyện.
 * @param {number} story_id - ID của câu chuyện.
 * @param {number} page - Số trang.
 * @param {number} limit - Số lượng đánh giá trên mỗi trang.
 * @returns {Promise<Object>} - Trả về danh sách đánh giá và thông tin phân trang.
 */
async function getReviewsByStoryId(story_id, page = 1, limit = 10) {
  try {
    const storyExists = await Story.findByPk(story_id)
    if (!storyExists) {
      throw createError(404, message.review.storyNotFound)
    }

    const offset = (page - 1) * limit
    const total = await Review.count({ where: { story_id } })
    const data = await Review.findAll({
      where: { story_id },
      limit,
      offset,
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
      ],
    })

    const pagination = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }

    return { data, pagination }
  } catch (error) {
    throw createError(500, message.review.fetchFailed)
  }
}

// GET REVIEWS BY USER ID
/**
 * Lấy danh sách đánh giá của một người dùng.
 * @param {number} user_id - ID của người dùng.
 * @param {number} page - Số trang.
 * @param {number} limit - Số lượng đánh giá trên mỗi trang.
 * @returns {Promise<{data: Array, pagination: Object}>} - Trả về danh sách đánh giá và thông tin phân trang.
 */
async function getReviewsByUserId(user_id, page = 1, limit = 10) {
  try {
    const userExists = await User.findByPk(user_id)
    if (!userExists) {
      // throw createError(404, 'cu')
    }
    console.log(userExists)
    const offset = (page - 1) * limit
    const total = await Review.count({ where: { user_id } })
    const reviews = await Review.findAll({
      where: { user_id },
      limit,
      offset,
      include: [{ model: Story, attributes: ['id', 'story_name'] }],
    })

    const pagination = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }

    return { data: reviews, pagination }
  } catch (error) {
    throw createError(500, message.review.fetchFailed)
  }
}
/**
 * Tìm kiếm đánh giá theo từ khóa.
 * @param {string} keyword - Từ khóa tìm kiếm.
 * @param {string} sortBy - Trường cần sắp xếp.
 * @param {string} order - Tăng hoặc giảm dần.
 * @param {number} page - Số trang.
 * @param {number} limit - Số lượng đánh giá trên mỗi trang.
 * @returns {Promise<Object>} - Dữ liệu đánh giá và thông tin phân trang.
 */
async function searchReviews(
  keyword,
  sortBy = 'created_at',
  order = 'DESC',
  page = 1,
  limit = 10,
) {
  const offset = (page - 1) * limit

  // Xây dựng `where` để tìm kiếm trong comment, username và story_name
  const where = {
    [Op.or]: [
      { comment: { [Op.like]: `%${keyword}%` } },
      { '$User.username$': { [Op.like]: `%${keyword}%` } },
      { '$Story.story_name$': { [Op.like]: `%${keyword}%` } },
    ],
  }

  // Kiểm tra `sortBy` để xây dựng `order` linh hoạt
  const orderClause = (() => {
    if (sortBy === 'username') {
      return [{ model: User }, 'username', order]
    } else if (sortBy === 'story_name') {
      return [{ model: Story }, 'story_name', order]
    } else {
      return [sortBy, order] // Mặc định sắp xếp theo Review
    }
  })()

  // Đếm tổng số kết quả
  const total = await Review.count({ where, include: [User, Story] })

  // Lấy dữ liệu đánh giá với điều kiện tìm kiếm và sắp xếp
  const data = await Review.findAll({
    where,
    limit,
    offset,
    order: [orderClause],
    include: [
      {
        model: User,
        attributes: ['id', 'username'],
      },
      {
        model: Story,
        attributes: ['id', 'story_name'],
      },
    ],
  })

  // Thông tin phân trang
  const pagination = {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
  }

  return { data, pagination }
}

// GET REVIEW BY ID
/**
 * Lấy thông tin chi tiết của một đánh giá theo user_id và story_id.
 * @param {number} user_id - ID của người dùng.
 * @param {number} story_id - ID của câu chuyện.
 * @returns {Promise<Object|null>} - Trả về đối tượng đánh giá hoặc null nếu không tìm thấy.
 */
async function getReviewByID(user_id, story_id) {
  try {
    const review = await Review.findOne({
      where: { user_id, story_id },
      include: [
        {
          model: User,
          attributes: ['id', 'username'],
        },
        {
          model: Story,
          attributes: ['id', 'story_name'],
        },
      ],
    })

    if (!review) {
      throw createError(404, message.review.notFound)
    }

    return review
  } catch (error) {
    throw createError(500, message.review.fetchFailed)
  }
}

// UPDATE REVIEW
/**
 * Cập nhật thông tin đánh giá.
 * @param {number} user_id - ID của người dùng.
 * @param {number} story_id - ID của câu chuyện.
 * @param {Object} updatedData - Đối tượng chứa dữ liệu cập nhật.
 * @returns {Promise<Object>} - Trả về đối tượng đánh giá đã được cập nhật.
 */
async function updateReview(user_id, story_id, updatedData) {
  try {
    const currentReview = await Review.findOne({ where: { user_id, story_id } })
    if (!currentReview) {
      throw createError(404, message.review.notFound)
    }

    // const storyExists = await Story.findByPk(story_id)
    // if (!storyExists) {
    //   throw createError(404, message.review.storyNotFound)
    // }
    // const userExists = await User.findByPk(user_id)
    // if (!userExists) {
    //   throw createError(404, message.user.notFound)
    // }

    await currentReview.update(updatedData)
    return await currentReview.reload()
  } catch (error) {
    console.log(error)
    if (error.name === 'SequelizeValidationError') {
      throw createError(400, error.errors.map((err) => err.message).join(', '))
    } else if (error.statusCode === 404) {
      throw createError(error.statusCode, error.message)
    } else {
      throw createError(error.statusCode || 500, message.review.updateFailed)
    }
  }
}

// DELETE REVIEW
/**
 * Xóa một đánh giá theo user_id và story_id.
 * @param {number} user_id - ID của người dùng.
 * @param {number} story_id - ID của câu chuyện.
 * @returns {Promise<void>} - Không trả về giá trị.
 */
async function deleteReview(user_id, story_id) {
  try {
    const review = await Review.findOne({ where: { user_id, story_id } })
    if (!review) {
      throw createError(404, message.review.notFound)
    }

    const storyExists = await Story.findByPk(story_id)
    if (!storyExists) {
      throw createError(404, message.review.storyNotFound)
    }

    const userExists = await User.findByPk(user_id)
    if (!userExists) {
      throw createError(404, message.user.notFound)
    }

    await review.destroy()
    return { success: true, message: message.review.deleteSuccess }
  } catch (error) {
    throw createError(500, message.review.deleteFailed)
  }
}

module.exports = {
  createReview,
  getReviews,
  getReviewsByStoryId,
  getReviewByID,
  updateReview,
  deleteReview,
  searchReviews,
  getReviewsByUserId,
}
