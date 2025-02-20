'use strict'
const express = require('express')
const router = express.Router()
const {
  handleCreateReview,
  handleGetAllReviews,
  handleGetReviewsByStoryId,
  handleUpdateReview,
  handleDeleteReview,
  handleGetReviewsByUserId,
  handleSearchReviews,
} = require('@controllers/review.controller')

// Route để tạo một đánh giá mới
router.post('/', handleCreateReview)

// Route để lấy tất cả đánh giá
router.get('/', handleGetAllReviews)
router.get('/search', handleSearchReviews)
// Route để lấy đánh giá của một người dùng cụ thể
router.get('/users/:user_id', handleGetReviewsByUserId)

// Route để lấy đánh giá theo ID truyện
router.get('/story/:storyId', handleGetReviewsByStoryId)

// Route để cập nhật đánh giá theo user_id và story_id
router.patch('/users/:user_id/stories/:story_id', handleUpdateReview)

// Route để xóa đánh giá theo user_id và story_id
router.delete('/users/:user_id/stories/:story_id', handleDeleteReview)

module.exports = router
