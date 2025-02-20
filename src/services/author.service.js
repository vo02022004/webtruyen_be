// const { Author } = require('../models');
const { Op } = require('sequelize'); // Import toán tử Op từ Sequelize
const createError = require('http-errors')
const message = require('../../message');
const { Author, Story, Genre } = require('../models');  // Import các model Sequelize

// Tạo tác giả mới
const createAuthor = async (authorData) => {
  try {
    return await Author.create(authorData);
  } catch (error) {
    // console.error(message.author.createFailed, error);
    throw createError({
      message: message.author.createFailed,
      error: error
    });
  }
};

// Lấy tất cả các tác giả với bộ lọc và phân trang
const getAllAuthors = async (
  author_name, description, sortBy, sortOrder, page, limit
) => {
  const pageInt = parseInt(page);

  try {
    // Validate parameters
    if (author_name && typeof author_name !== 'string') {
      throw createError(message.author.author_nameRequired);
    }
    if (description && typeof description !== 'string') {
      throw createError(message.author.descriptionRequired);
    }
    if (!['ASC', 'DESC'].includes(sortOrder.toUpperCase())) {
      throw createError(message.author.sortOrderRequired);
    }
    if (!Number.isInteger(pageInt) || pageInt < 1) {
      throw createError(message.author.pageRequired);
    }
    if (!Number.isInteger(limit) || limit < 1) {
      throw createError(message.author.limitRequired);
    }

    // Construct the where conditions based on provided parameters
    const where = {};
    if (author_name) {
      where.author_name = { [Op.like]: `%${author_name}%` };
    }
    if (description) {
      where.description = { [Op.like]: `%${description}%` };
    }

    // Calculate pagination variables
    const offset = (page - 1) * limit;

    // Fetch authors with pagination and sorting
    const authors = await Author.findAll({
      where,
      order: [[sortBy, sortOrder.toUpperCase()]],
      offset,
      limit,
      attributes: [
        'id',
        'author_name',
        'description',
        'slug',
      ],
    });

    // Count total authors matching criteria
    const totalCount = await Author.count({ where });

    // Return authors and pagination info
    return {
      authors,
      totalCount,
      totalPages: Math.ceil(totalCount / limit),
      currentPage: page,
    };
  } catch (error) {
    console.error(message.author.error, error.message);
    throw createError(message.author.error, error.message);
  }
};
const getAllAuthorsName = async (
) => {
  try {
    const authors = await Author.findAll({
      attributes: [
        'id',
        'author_name',
      ],
    });
    return {
      authors,
    };
  } catch (error) {
    console.error(message.author.error, error.message);
    throw createError(message.author.error, error.message);
  }
};


// Lấy tác giả theo ID
const getAuthorById = async (id) => {
  try {
    return await Author.findByPk(id, {
      attributes: [
        'id',
        'author_name',
        'description',
        'slug',
      ],
    });
  } catch (error) {
    console.error(message.author.error, error);
    throw error;
  }
};

// Cập nhật tác giả
const updateAuthor = async (id, authorData) => {
  try {
    // Tìm tác giả theo ID
    const author = await Author.findByPk(id);
    if (!author) {
      // Nếu không tìm thấy tác giả, ném lỗi với thông điệp rõ ràng
      throw createError(404, message.author.notFound);
    }

    // Thực hiện cập nhật tác giả
    const updatedRows = await Author.update(authorData, { where: { id } });

    // Nếu không có dòng nào bị cập nhật (có thể không có thay đổi nào)
    if (updatedRows === 0) {
      throw createError(400, message.author.noChanges);
    }

    return updatedRows; // Trả về số dòng đã cập nhật
  } catch (error) {
    console.error('Error updating author:', error);
    throw error; // Ném lại lỗi để xử lý bên ngoài
  }
};


// Xóa tác giả
const deleteAuthor = async (id) => {
  try {
    const author = await Author.findByPk(id);
    if (!author) {
      throw createError(404, message.author.notFound);
    }
    const deletedRows = await Author.destroy({ where: { id } });
    if (deletedRows === 0) {
      throw createError(404, message.author.notFound); // Cũng ném lỗi nếu không có hàng nào bị xóa
    }

    return deletedRows;
  } catch (error) {
    console.error('Error deleting author:', error);
    throw error; // Ném lại lỗi để xử lý bên ngoài
  }
};


// Service để lấy thông tin tác giả và các sách của tác giả
// const getAuthorWithStories = async (slug, page, limit) => {
//   try {
//     console.log(slug, page, limit);
    
//     // Kiểm tra và tính toán offset và limit cho phân trang
//     const offset = (page - 1) * limit;

//     // Sử dụng Sequelize để truy vấn tác giả và câu chuyện với phân trang
//     const author = await Author.findOne({
//       where: { slug },
//       attributes: ['id', 'author_name', 'slug', 'description'],
//       include: [
//         {
//           model: Story,
//           as: 'stories',
//           attributes: ['id', 'story_name', 'slug', 'cover', 'total_chapters'],
//           limit,   // Số lượng câu chuyện mỗi lần truy vấn
//           offset,  // Vị trí bắt đầu của câu chuyện (dựa trên trang)
//           include: [
//             {
//               model: Genre,
//               as: 'genres',
//               attributes: ['genre_name', 'slug']
//             }
//           ]
//         }
//       ]
//     });

//     // Nếu không tìm thấy tác giả, trả về null
//     if (!author) {
//       throw new Error('Author not found');
//     }

//     // Truy vấn số lượng câu chuyện tổng cộng của tác giả để tính tổng số trang
//     const totalStories = await Story.count({
//     });

//     // Tính tổng số trang
//     const totalPages = Math.ceil(totalStories / limit);

//     // Trả về tác giả, câu chuyện với phân trang và tổng số trang
//     return {
//       author,
//       totalPages
//     };
//   } catch (error) {
//     // Nếu có lỗi, throw ra error để xử lý ở nơi gọi
//     throw new Error(`Error fetching author with stories: ${error.message}`);
//   }
// };

const getAuthorWithStories = async (slug, page, limit) => {
  try {
    console.log(slug, page, limit);
    
    // Kiểm tra và tính toán offset và limit cho phân trang
    const offset = (page - 1) * limit;

    // Sử dụng Sequelize để truy vấn tác giả và câu chuyện với phân trang
    const author = await Author.findOne({
      where: { slug },
      attributes: ['id', 'author_name', 'slug', 'description'],
      include: [
        {
          model: Story,
          as: 'stories',
          attributes: ['id', 'story_name', 'slug', 'cover', 'total_chapters'],
          limit,   // Số lượng câu chuyện mỗi lần truy vấn
          offset,  // Vị trí bắt đầu của câu chuyện (dựa trên trang)
          include: [
            {
              model: Genre,
              as: 'genres',
              attributes: ['genre_name', 'slug']
            }
          ]
        }
      ]
    });

    // Nếu không tìm thấy tác giả, trả về null
    if (!author) {
      throw new Error('Author not found');
    }

    // Truy vấn số lượng câu chuyện tổng cộng của tác giả để tính tổng số trang
    const totalStories = await Story.count({
      where: { author_id: author.id } // Đảm bảo tính số câu chuyện của tác giả này
    });

    // Tính tổng số trang
    const totalPages = Math.ceil(totalStories / limit);
    console.log("totalpage:" +totalPages);
    

    // Trả về tác giả, câu chuyện với phân trang và tổng số trang
    return {
      author,
      totalPages,
      totalStories // Cung cấp tổng số câu chuyện để có thể sử dụng trong tính toán
    };
  } catch (error) {
    // Nếu có lỗi, throw ra error để xử lý ở nơi gọi
    throw new Error(`Error fetching author with stories: ${error.message}`);
  }
};



module.exports = {
  getAuthorWithStories
};

module.exports = { getAuthorWithStories };











module.exports = {
  createAuthor,
  getAllAuthors,
  getAuthorById,
  updateAuthor,
  deleteAuthor,
  getAllAuthorsName,
  getAuthorWithStories
};
