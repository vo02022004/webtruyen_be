// src/routes/genreStorie.router.js
const express = require('express');
const router = express.Router();
const storyGenreController = require('../controllers/storyGenre.controller');

// Route để thêm một genre vào story
router.post('/', storyGenreController.addStoryGenre);

module.exports = router;
