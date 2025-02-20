const { Story, Author, Genre } = require('../models')
const { Op } = require('sequelize') // Import toán tử Op từ Sequelize
const message = require('../../message')
const createError = require('http-errors')

// Tạo một câu chuyện mới với xử lý lỗi
exports.createStory = async (storyData) => {
  try {
    const story = await Story.create(storyData)
    return { success: true, data: story }
  } catch (error) {
    console.error('Lỗi khi tạo câu chuyện:', error)
    return { success: false, error: 'Không thể tạo câu chuyện' }
  }
}

// Lấy tất cả các câu chuyện với xử lý lỗi

exports.getAllStories = async (story_name, description, sortBy, sortOrder, page, limit) => {
  try {
    // Kiểm tra các tham số đầu vào
    if (story_name && typeof story_name !== 'string') {
      throw this.createError(message.story.story_nameRequired)
    }

    if (description && typeof description !== 'string') {
      throw createError(message.story.descriptionRequired)
    }

    const validSortOrders = ['ASC', 'DESC']
    if (sortOrder && !validSortOrders.includes(sortOrder.toUpperCase())) {
      throw createError(message.story.sortOrderRequired)
    }

    const pageInt = parseInt(page)
    if (isNaN(pageInt) || pageInt < 1) {
      throw createError(message.story.pageRequired)
    }

    const limitInt = parseInt(limit)
    if (isNaN(limitInt) || limitInt < 1) {
      throw createError(message.story.limitRequired)
    }

    const whereConditions = [];

    // Tách từ khóa thành các phần nhỏ và tạo điều kiện tìm kiếm cho từng ký tự
    const searchTerms = [];
    if (story_name) {
      searchTerms.push(...story_name.split(/\s+/)); // Tách theo dấu cách
    }
    if (description) {
      searchTerms.push(...description.split(/\s+/)); // Tách theo dấu cách
    }

    // Tạo điều kiện tìm kiếm cho mỗi phần tử trong searchTerms
    searchTerms.forEach(term => {
      whereConditions.push(
        { story_name: { [Op.like]: `%${term}%` } },
        { description: { [Op.like]: `%${term}%` } }
      );
    });

    // Thêm điều kiện đảo ngược từ khóa (ví dụ: "action drama" -> "drama action")
    if (searchTerms.length > 1) {
      const reversedKeywords = searchTerms.reverse().join(" ");
      whereConditions.push(
        { story_name: { [Op.like]: `%${reversedKeywords}%` } },
        { description: { [Op.like]: `%${reversedKeywords}%` } }
      );
    }

    console.log('Where Conditions:', whereConditions);

    // Lấy danh sách câu chuyện với phân trang
    const stories = await Story.findAll({
      where: whereConditions.length > 0 ? { [Op.or]: whereConditions } : {},
      order: [[sortBy, sortOrder ? sortOrder.toUpperCase() : "ASC"]], // Mặc định là ASC nếu không có sortOrder
      offset: (pageInt - 1) * limitInt,
      limit: limitInt,
      attributes: [
        'id',
        'status',
        'author_id',
        'description',
        'story_name',
        'total_chapters',
        'views',
        'cover',
        'keywords',
        'slug',
      ],
      include: [
        {
          model: Author,
          as: 'author',
          attributes: ['author_name', 'id'],
        },
      ],
    });

    console.log(stories);
    // Đếm tổng số câu chuyện phù hợp với tiêu chí
    const totalCount = await Story.count({
      where: whereConditions.length > 0 ? { [Op.or]: whereConditions } : {},
    });

    // Trả về danh sách câu chuyện, tổng số và số trang
    const result = {
      stories: stories.length > 0 ? stories : [],
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limitInt), // Tính tổng số trang
      currentPage: pageInt,
    };

    return result;
  } catch (error) {
    console.error(message.story.error, error);
    throw createError(message.story.error, error.message);
  }
};


exports.searchStories = async (keyword, page, limit) => {
  try {
    console.log("Đang tìm kiếm câu chuyện với từ khóa:", page, limit);

    // Kiểm tra từ khóa
    if (!keyword || typeof keyword !== 'string') {
      throw createError(400, "Từ khóa là bắt buộc và phải là một chuỗi.");
    }

    // Kiểm tra giá trị của page và limit
    if (isNaN(page) || page <= 0) {
      throw createError(400, "Số trang không hợp lệ. Vui lòng cung cấp số trang hợp lệ.");
    }
    limit = parseInt(limit, 10);

    if (isNaN(limit) || limit <= 0) {
      throw createError(400, "Giới hạn số lượng câu chuyện không hợp lệ. Vui lòng cung cấp một giới hạn hợp lệ.");
    }

    // Tách từ khóa thành các phần tử nhỏ hơn để tìm kiếm từng từ
    const searchTerms = keyword.trim().split(/\s+/);

    // Tạo mảng điều kiện tìm kiếm
    const whereConditions = searchTerms.map(term => ({
      [Op.or]: [
        { description: { [Op.like]: `%${term}%` } },
        { story_name: { [Op.like]: `%${term}%` } },
        { keywords: { [Op.like]: `%${term}%` } }
      ]
    }));

    // Tính toán offset và limit
    const offset = (page - 1) * limit;

    // Tìm kiếm các câu chuyện với điều kiện tìm kiếm và phân trang
    const stories = await Story.findAll({
      where: {
        [Op.and]: whereConditions // Kết hợp tất cả các điều kiện tìm kiếm
      },
      offset: offset,
      limit: limit,
      attributes: [
        "id",
        "status",
        "author_id",
        "description",
        "story_name",
        "total_chapters",
        "views",
        "cover",
        "keywords",
        "slug"
      ],
      include: [
        {
          model: Author,
          as: 'author',
          attributes: ['author_name', 'id'],
        },
        {
          model: Genre,
          as: 'genres',
          attributes: ['id', 'genre_name'],
        }
      ],
      // include: [
      //   {
      //     model: Genre,
      //     as: 'genres',
      //     attributes: ['id', 'genre_name'],
      //   },
      // ],
    });

    // Đếm tổng số câu chuyện phù hợp với tiêu chí
    const totalCount = await Story.count({
      where: {
        [Op.and]: whereConditions
      }
    });

    // Tính tổng số trang
    const totalPages = Math.ceil(totalCount / limit);

    // Trả về kết quả tìm kiếm cùng thông tin phân trang
    return {
      success: true,
      data: stories,
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: page
    };
  } catch (error) {
    // In ra lỗi chi tiết
    console.error("Lỗi khi tìm kiếm câu chuyện:", error);

    // Kiểm tra và ném lại lỗi cụ thể
    if (error.isJoi) {
      // Nếu lỗi là từ Joi validation, trả về lỗi chi tiết
      throw createError(400, `Lỗi đầu vào: ${error.details.map(e => e.message).join(', ')}`);
    }

    // Lỗi khác
    throw createError(500, `Lỗi hệ thống: Không thể tìm kiếm câu chuyện. Chi tiết lỗi: ${error.message}`);
  }
};

exports.getAllStorieView = async (
  story_name,
  description,
  sortOrder,
  page,
  limit,
) => {
  console.log('check story_name:', story_name)
  console.log('check description:', description)
  console.log('check sortOrder:', sortOrder)
  console.log('check page:', page)
  console.log('check limit:', limit)

  try {
    // Kiểm tra các tham số
    if (story_name && typeof story_name !== 'string') {
      throw this.createError(message.story.story_nameRequired)
    }

    if (description && typeof description !== 'string') {
      throw createError(message.story.descriptionRequired)
    }

    const pageInt = parseInt(page)
    if (isNaN(pageInt) || pageInt < 1) {
      throw createError(message.story.pageRequired)
    }

    const limitInt = parseInt(limit)
    if (isNaN(limitInt) || limitInt < 1) {
      throw createError(message.story.limitRequired)
    }

    const whereConditions = []

    // Xây dựng điều kiện where nếu story_name hoặc description được cung cấp
    if (story_name) {
      whereConditions.push({
        story_name: {
          [Op.like]: `%${story_name}%`,
        },
      })
    }

    if (description) {
      whereConditions.push({
        description: {
          [Op.like]: `%${description}%`,
        },
      })
    }

    console.log('Where Conditions:', whereConditions)

    // Lấy danh sách câu chuyện với phân trang
    const stories = await Story.findAll({
      where: whereConditions.length > 0 ? { [Op.or]: whereConditions } : {},
      order: [['views', 'DESC']], // Sắp xếp theo views giảm dần
      offset: (pageInt - 1) * limitInt,
      limit: limitInt,
      attributes: [
        'id',
        'status',
        'author_id',
        'description',
        'story_name',
        'total_chapters',
        'views',
        'cover',
        'keywords',
        'slug',
      ],
    })

    // Đếm tổng số câu chuyện phù hợp với tiêu chí
    const totalCount = await Story.count({
      where: whereConditions.length > 0 ? { [Op.or]: whereConditions } : {},
    })

    // Trả về danh sách câu chuyện, tổng số và số trang
    const result = {
      stories: stories.length > 0 ? stories : [],
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limitInt), // Tính tổng số trang
      currentPage: pageInt,
    }

    return result
  } catch (error) {
    console.error(message.story.error, error)
    throw createError(message.story.error, error.message)
  }
}
// storyService.js
// v
exports.getStoryBySlug = async (slug) => {
  try {
    console.log(slug)
    const story = await Story.findOne({
      where: { slug }, // Tìm theo slug
      attributes: [
        'id',
        'status',
        'author_id',
        'description',
        'story_name',
        'total_chapters',
        'views',
        'cover',
        'keywords',
        'slug',
        'updated_at',
      ],
    })

    return story
  } catch (error) {
    console.error('Error fetching story by slug:', error)
    throw error
  }
}

// v
exports.getAllStorieNew = async (
  story_name,
  description,
  sortOrder,
  page,
  limit,
) => {
  console.log('HAM NEW')
  console.log('check story_name:', story_name)
  console.log('check description:', description)
  console.log('check sortOrder:', sortOrder)
  console.log('check page:', page)
  console.log('check limit:', limit)

  try {
    // Kiểm tra các tham số
    if (story_name && typeof story_name !== 'string') {
      throw createError(message.story.story_nameRequired)
    }

    if (description && typeof description !== 'string') {
      throw createError(message.story.descriptionRequired)
    }

    const pageInt = parseInt(page)
    if (isNaN(pageInt) || pageInt < 1) {
      throw createError(message.story.pageRequired)
    }

    const limitInt = parseInt(limit)
    if (isNaN(limitInt) || limitInt < 1) {
      throw createError(message.story.limitRequired)
    }

    const whereConditions = []

    // Xây dựng điều kiện where nếu story_name hoặc description được cung cấp
    if (story_name) {
      whereConditions.push({
        story_name: {
          [Op.like]: `%${story_name}%`,
        },
      })
    }

    if (description) {
      whereConditions.push({
        description: {
          [Op.like]: `%${description}%`,
        },
      })
    }

    console.log('Where Conditions:', whereConditions)

    // Lấy danh sách câu chuyện với phân trang
    const stories = await Story.findAll({
      where: whereConditions.length > 0 ? { [Op.or]: whereConditions } : {},
      order: [['updated_at', 'DESC']], // Sắp xếp theo ngày cập nhật mới nhất
      offset: (pageInt - 1) * limitInt,
      limit: limitInt,
      attributes: [
        'id',
        'status',
        'author_id',
        'description',
        'story_name',
        'total_chapters',
        'views',
        'cover',
        'keywords',
        'slug',
        'updated_at', // Thêm updated_at để hiển thị ngày cập nhật
      ],
    })

    // Đếm tổng số câu chuyện phù hợp với tiêu chí
    const totalCount = await Story.count({
      where: whereConditions.length > 0 ? { [Op.or]: whereConditions } : {},
    })

    // Trả về danh sách câu chuyện, tổng số và số trang
    const result = {
      stories: stories.length > 0 ? stories : [],
      totalCount: totalCount,
      totalPages: Math.ceil(totalCount / limitInt), // Tính tổng số trang
      currentPage: pageInt,
    }

    return result
  } catch (error) {
    console.error(message.story.error, error)
    throw createError(message.story.error, error.message)
  }
}

// Lấy một câu chuyện theo ID với xử lý lỗi khi ID không tồn tại
exports.getStoryById = async (id) => {
  console.log("checl", id);

  try {
    const story = await Story.findByPk(id, {
      attributes: [
        'id', 'status', 'author_id', 'description', 'story_name',
        'total_chapters', 'views', 'cover', 'keywords', 'slug',
        'created_at', 'updated_at',
      ],
      include:
      {
        model: Author,
        as: 'author',
        attributes: ['author_name', 'id'],
      },
    });
    if (!story) {
      return { success: false, message: message.story.notFound }
    }
    return { success: true, data: story }
  } catch (error) {
    console.error(`Lỗi khi lấy câu chuyện với ID ${id}:`, error)
    return { success: false, error: message.story.notFound }
  }
}

// Cập nhật một câu chuyện với xử lý lỗi khi ID không tồn tại
exports.updateStory = async (id, storyData) => {
  try {
    // Kiểm tra xem câu chuyện có tồn tại không trước khi cập nhật
    const story = await Story.findByPk(id, {
      attributes: [
        'id', 'status', 'author_id', 'description', 'story_name',
        'total_chapters', 'views', 'cover', 'keywords', 'slug',
        'created_at', 'updated_at',
      ],
    });

    if (!story) {
      // Nếu không tìm thấy câu chuyện, ném lỗi với mã trạng thái 404
      throw createError(404, message.story.notFound)
    }

    // Thực hiện cập nhật dữ liệu câu chuyện
    const updatedRows = await Story.update(storyData, { where: { id } })

    if (updatedRows === 0) {
      // Nếu không có hàng nào được cập nhật, có thể là không có thay đổi nào
      throw createError(400, message.story.noChanges)
    }

    // Lấy lại thông tin câu chuyện sau khi cập nhật
    const updatedStory = await Story.findByPk(id, {
      attributes: [
        'id', 'status', 'author_id', 'description', 'story_name',
        'total_chapters', 'views', 'cover', 'keywords', 'slug',
        'created_at', 'updated_at',
      ],
    });

    // Trả về đối tượng thành công với dữ liệu câu chuyện đã cập nhật
    return { success: true, data: updatedStory }
  } catch (error) {
    console.error(`Lỗi khi cập nhật câu chuyện với ID ${id}:`, error)

    // Kiểm tra xem lỗi có phải là một lỗi do người dùng gửi không
    if (error.status && error.message) {
      throw createError(error.status, error.message)
    }

    // Nếu lỗi không xác định, ném lỗi 500 Internal Server Error
    throw createError(500, message.story.updateFailed)
  }
}

// Xóa một câu chuyện với xử lý lỗi khi ID không tồn tại
exports.deleteStory = async (id) => {
  try {
    // Kiểm tra xem câu chuyện có tồn tại không trước khi xóa
    const story = await Story.findByPk(id, {
      attributes: [
        'id', 'status', 'author_id', 'description', 'story_name',
        'total_chapters', 'views', 'cover', 'keywords', 'slug',
        'created_at', 'updated_at',
      ],
    });
    if (!story) {
      throw createError({ status: 404, message: message.story.notFound }) // Đặt status là 404 cho không tìm thấy
    }

    // Nếu câu chuyện tồn tại, thực hiện xóa
    await Story.destroy({ where: { id } })
    return { success: true, message: message.story.deleteSuccess }
  } catch (error) {
    // console.error(`Lỗi khi xóa câu chuyện với ID ${id}:`, error);
    // Nếu error không có thông tin message, trả về thông báo mặc định
    const errorMessage =
      error.message || 'Không thể xóa câu chuyện. Vui lòng thử lại sau.'
    throw createError({ success: false, message: errorMessage }) // Trả về thông báo lỗi chi tiết
  }

}


// exports.getStoriesByGenreSlug = async (slug) => {
//   try {
//     const stories = await Story.findAll({
//       attributes: [
//         'id', 
//         'story_name', 
//         'slug', 
//         'cover', 
//         'description', 
//         'total_chapters',
//         'author_id',
//       ],
//       include: [
//         {
//           model: Genre,
//           as: 'genres',  // Đặt alias cho quan hệ Genre
//           attributes: ['genre_name', 'slug'],
//           through: { attributes: [] }, // Loại bỏ cột của bảng join
//           where: { slug: slug },
//         },
//         {
//           model: Author,
//           as: 'author',  // Đặt alias cho quan hệ Author
//           attributes: ['author_name', 'slug'],
//         }
//       ]
//     });

//     return stories;
//   } catch (error) {
//     throw error; // Ném lỗi để controller có thể xử lý
//   }
// };

// service story
exports.getStoriesByGenreSlug = async (slug, page, limit) => {
  try {
    const offset = (page - 1) * limit; // Tính toán offset dựa trên page và limit

    // Truy vấn danh sách câu chuyện thuộc thể loại cụ thể với phân trang
    const stories = await Story.findAll({
      attributes: [
        'id',
        'story_name',
        'slug',
        'cover',
        'description',
        'total_chapters',
        'author_id',
      ],
      include: [
        {
          model: Genre,
          as: 'genres',
          attributes: ['genre_name', 'slug'],
          through: { attributes: [] },
          where: { slug: slug }, // Tìm thể loại theo slug
        },
        {
          model: Author,
          as: 'author',
          attributes: ['author_name', 'slug'],
        }
      ],
      limit: limit, // Giới hạn số lượng câu chuyện trên mỗi trang
      offset: offset,  // Áp dụng offset để phân trang
    });

    // Trả về danh sách câu chuyện
    return stories;
  } catch (error) {
    throw error;
  }
};

exports.incrementStoryViews = async (storyId) => {
  // Tìm kiếm câu chuyện theo ID
  const story = await Story.findByPk(storyId);
  if (!story) {
    throw new Error("Câu chuyện không tồn tại!");
  }

  // Tăng giá trị `views`
  story.views += 1;

  // Lưu thay đổi
  await story.save();

  // Trả về thông tin câu chuyện sau khi cập nhật
  return story;
};

// module. = { getStoriesByGenreSlug };
