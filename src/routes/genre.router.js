// routes/genre.router.js
const express = require('express');
const router = express.Router();
const genreController = require('../controllers/genre.controller');

// Route để lấy tất cả genres
router.get('/', genreController.getAllGenresByName);
router.get('/getAllgenres', genreController.getAllGenres);

// Route để lấy một genre cụ thể theo ID
router.get('/:id', genreController.getGenreById);

// Route để tạo một genre mới
router.post('/', genreController.createGenre);

// Route để cập nhật một genre theo ID
router.put('/:id', genreController.updateGenre);

// Route để xóa một genre theo ID
router.delete('/:id', genreController.deleteGenre);

//route lay the loai theo slug
// router.get('/:slug', genreController.handleGetGenresBySlug)

// // Route lấy danh sách truyện theo genre slug
// router.get('/getstorybygenre/:slug', genreController.handleGetStoriesByGenre); // Lấy truyện theo thể loại (slug)

module.exports = router;
