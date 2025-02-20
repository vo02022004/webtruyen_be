const { Genre } = require('../models');
const createError = require("http-errors");
const { Op } = require("sequelize");


class GenreService {
  static async getAllGenres() {
    try {
      return await Genre.findAll()
    } catch (error) {
      throw new Error('Error fetching genres')
    }
  }
  static async getGenres(keyword, sortBy, order, page, limit) {
    try {
      console.log("KEYWORD:", keyword);

      // Tách từ khóa thành từng từ hoặc ký tự để tạo các điều kiện tìm kiếm
      const searchTerms = keyword.split(/\s+/); // Tách từ theo dấu cách

      // Tạo mảng điều kiện tìm kiếm với từng từ hoặc ký tự
      const searchConditions = searchTerms.flatMap(term => [
        { genre_name: { [Op.like]: `%${term}%` } },
        { description: { [Op.like]: `%${term}%` } },
      ]);

      // Thêm điều kiện đảo ngược từ khóa (ví dụ: "A B" -> "B A")
      if (searchTerms.length > 1) {
        const reversedKeyword = searchTerms.reverse().join(" ");
        searchConditions.push(
          { genre_name: { [Op.like]: `%${reversedKeyword}%` } },
          { description: { [Op.like]: `%${reversedKeyword}%` } }
        );
      }

      // Tính tổng số bản ghi phù hợp
      const total = await Genre.count({
        where: {
          [Op.or]: searchConditions,
        },
      });

      // Lấy danh sách thể loại phù hợp từ cơ sở dữ liệu
      const data = await Genre.findAll({
        attributes: ['id', 'genre_name', 'description', 'slug'],
        where: {
          [Op.or]: searchConditions,
        },
        order: [[sortBy, order]],
        limit: limit,
        offset: (page - 1) * limit,
      });

      if (!data.length) throw createError(404, "Không tìm thấy thể loại nào");

      // Tạo đối tượng chứa thông tin phân trang
      const pagination = {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      };

      return { data, pagination };
    } catch (error) {
      if (error.status === 404) {
        throw createError(404, "Không tìm thấy thể loại phù hợp với từ khóa");
      } else {
        throw createError(500, "Có lỗi xảy ra khi lấy danh sách thể loại");
      }
    }
  }

  static async getGenreById(id) {
    try {
      const genre = await Genre.findByPk(id);
      if (!genre) throw createError(404, 'Genre not found');
      return genre;
    } catch (error) {
      throw createError(500, error.message);
    }
  }




  static async createGenre(data) {
    try {
      const { genre_name, description, slug } = data
      return await Genre.create({ genre_name, description, slug })
    } catch (error) {
      throw new Error('Error creating genre')
    }
  }

  static async updateGenre(id, data) {
    try {
      const genre = await Genre.findByPk(id)
      if (!genre) throw new Error('Genre not found')

      genre.genre_name = data.genre_name || genre.genre_name
      genre.description = data.description || genre.description
      genre.slug = data.slug || genre.slug

      await genre.save()
      return genre
    } catch (error) {
      throw new Error(error.message)
    }
  }

  static async deleteGenre(id) {
    try {
      const genre = await Genre.findByPk(id)
      if (!genre) throw new Error('Genre not found')
      await genre.destroy()
      return { message: 'Genre deleted successfully' }
    } catch (error) {
      throw new Error(error.message)
    }
  }
  static async getGenresBySlug(slug) {
    try {
      const genre = await Genre.findAll({
        where: {
          slug: slug,
        },
      })
      return genre
    } catch (error) {
      throw new Error(error.message)
    }
  }
}

module.exports = GenreService
