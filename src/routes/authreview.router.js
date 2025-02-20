'use strict'
const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/authreview.controller');

// Route để người dùng tạo đánh giá truyện
router.post('/add', reviewController.handleCreateUserReview);

// Route để lấy danh sách đánh giá của một truyện
router.get('/story/:storyId', reviewController.handleGetUserReviews);

// Route để lấy danh sách đánh giá của một người dùng
router.get('/user/:userId', reviewController.handleGetUserReviews);

// Route để cập nhật đánh giá
router.put('/update/:user_id/:story_id', reviewController.handleUpdateUserReview);

// Route để xóa đánh giá
router.delete('/delete/:storyID', reviewController.handleDeleteUserReview);

module.exports = router;
