const { Review, User, Story } = require('@models')
const createError = require('http-errors')
const message = require('@root/message')
const { Op } = require('sequelize')

/**
 * Kiểm tra xem người dùng đã đánh giá truyện này chưa
 * @param {number} user_id - ID của người dùng
 * @param {number} story_id - ID của truyện
 * @returns {Object|null} - Đánh giá nếu tồn tại, ngược lại null
 */
const getReviewByUserAndStory = async (user_id, story_id) => {
  return await Review.findOne({
    where: {
      user_id,
      story_id,
    },
  })
}

/**
 * Tạo mới đánh giá
 * @param {Object} data - Dữ liệu đánh giá
 * @param {number} data.user_id - ID của người dùng
 * @param {number} data.story_id - ID của truyện
 * @param {number} data.star - Số sao đánh giá
 * @param {string} data.comment - Bình luận
 * @returns {Object} - Đánh giá mới được tạo
 */
const createReview = async ({ user_id, story_id, star, comment }) => {
  const existingReview = await getReviewByUserAndStory(user_id, story_id)
  //  const story = await Story.findByPk(story_id);  // Sử dụng `findByPk` để tìm theo ID
  // if (!stories) {
  //   throw createError(404, message.authreview.storyNotFound);  // Nếu không tìm thấy truyện
  // }
  if (existingReview) {
    throw createError(400, message.authreview.alreadyReviewed)
  }

  const review = await Review.create({
    user_id,
    story_id,
    star,
    comment,
  })
  return review
}

/**
 * Lấy danh sách đánh giá của một truyện
 * @param {number} story_id - ID của truyện
 * @returns {Array} - Danh sách đánh giá
 */
const getReviewsByStory = async (story_id) => {
  return await Review.findAll({
    where: { story_id },
    include: [
      {
        model: User,
        attributes: ['id', 'username', 'avatar'],
      },
    ],
    order: [['created_at', 'DESC']],
  })
}

/**
 * Lấy danh sách đánh giá của một người dùng
 * @param {number} user_id - ID của người dùng
 * @returns {Array} - Danh sách đánh giá
 */
const getReviewsByUserId = async (user_id) => {
  return await Review.findAll({
    where: { user_id },
    include: [
      {
        model: Story,
        attributes: ['id', 'title', 'cover'],
      },
    ],
    order: [['created_at', 'DESC']],
  })
}

/**
 * Cập nhật đánh giá
 * @param {Object}  - Dữ liệu cập nhật
 * @param {number} story_id - ID của đánh giá
 * @param {number} user_id - ID của người dùng (để kiểm tra quyền)
 * @param {number} star - Số sao mới
 * @param {string} comment - Bình luận mới
 * @returns {Object} - Đánh giá đã được cập nhật
 */
const updateReview = async ({user_id, story_id, star, comment }) => {
  const review = await Review.findOne({
    where: {
      user_id, story_id
    },
  })

  if (!review) {
    throw createError(404, message.authreview.notFound)
  }

  review.star = star
  review.comment = comment
  await review.save()

  return review
}

/**
 * Xóa đánh giá
 * @param {number} story_id - ID của đánh giá
 * @param {number} user_id - ID của người dùng (để kiểm tra quyền)
 */
const deleteReview = async ({ story_id, user_id }) => {
  const review = await Review.findOne({
    where: {
      user_id, story_id
    },
  })

  if (!review) {
    throw createError(404, message.authreview.notFound)
  }

  await review.destroy()
}

module.exports = {
  getReviewByUserAndStory,
  createReview,
  getReviewsByStory,
  getReviewsByUserId,
  updateReview,
  deleteReview,
}
