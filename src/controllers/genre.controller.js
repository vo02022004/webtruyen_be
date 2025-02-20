// controllers/genreController.js
const { date } = require('joi');
const message = require('../../message');
const GenreService = require('../services/genre.service');

const getAllGenresByName = async (req, res) => {
    try {
        const genres = await GenreService.getAllGenres();
        console.log(genres);

        res.json({
            message: "lay du lieu thanh cong",
            data: genres
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
const getAllGenres = async (req, res) => {
    console.log("check", req.query);

    const { keyword, sortBy = 'id', order = 'ASC', page = 1, limit = 10 } = req.query;
    try {
        // Gọi đến service để lấy danh sách thể loại và thông tin phân trang
        const { pagination, data } = await GenreService.getGenres(keyword, sortBy, order, page, limit);

        // Trả về dữ liệu theo định dạng chuẩn
        res.json({
            message: "Lấy dữ liệu thành công",
            pagination: pagination,
            data: data,
        });
    } catch (error) {
        // Trả về thông báo lỗi khi có sự cố
        console.error(error);
        res.status(500).json({
            message: "Có lỗi xảy ra khi lấy dữ liệu thể loại",
            error: error.message || 'Lỗi không xác định'
        });
    }
};


const getGenreById = async (req, res) => {
    try {
        const genre = await GenreService.getGenreById(req.params.id);
        res.json({
            message: "lấy dữ liệu thành công",
            data: genre
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const createGenre = async (req, res) => {
    try {
        const newGenre = await GenreService.createGenre(req.body);
        res.status(201).json({
            message: "tạo thể loại thành công",
            data: newGenre
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

const updateGenre = async (req, res) => {
    try {
        const updatedGenre = await GenreService.updateGenre(req.params.id, req.body);
        res.json({
            message: "cập nhật dữ liệu thành công",
            data: updatedGenre
        });
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const deleteGenre = async (req, res) => {
    try {
        const result = await GenreService.deleteGenre(req.params.id);
        res.json(result);
    } catch (error) {
        res.status(404).json({ message: error.message });
    }
};

const handleGetGenresBySlug = async (req, res) => {
    const { slug } = req.params
    console.log('>>slug duoc goi1: ', slug)
    //xac thuc du lieu
  
    const result = await GenreService.getGenresBySlug(slug)
    console.log(result)
    return res.status(200).json(result)
  }
const handleGetStoriesByGenre = async (req, res) => {
    const { slug } = req.params
    console.log('>>slug duoc goi2: ', slug)
    //xac thuc du lieu
  
    const result = await GenreService. getStoriesByGenre(slug)
    console.log(result)
    return res.status(200).json(result)
  }
//   import hàm
module.exports = {
    getAllGenresByName,
    getAllGenres,
    getGenreById,
    createGenre,
    updateGenre,
    deleteGenre,
    handleGetGenresBySlug,
    handleGetStoriesByGenre,
};
