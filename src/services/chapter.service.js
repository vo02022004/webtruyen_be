const { Chapter, Story, Author, Genre } = require('@models')
const createError = require('http-errors')
const message = require('@root/message')
const { Op } = require('sequelize')
const { chapter } = require('../../message')
// const createError = require('http-errors')

// ==========================
// Chapter CRUD Functions
// ==========================

// CREATE CHAPTER
/**
 * Tạo một chương mới.
 * @param {Object} chapter - Đối tượng chứa thông tin chương mới.
 * @returns {Promise<Object>} - Trả về đối tượng chương đã được tạo.
 */
async function createChapter(chapter) {
  try {
    return await Chapter.create(chapter)
  } catch (error) {
    console.log(error)
    if (error.name === 'SequelizeValidationError') {
      throw createError(400, error.errors.map((err) => err.message).join(', '))
    } else if ((error.name = 'SequelizeUniqueConstraintError')) {
      throw createError(409, error.errors.map((err) => err.message).join(', '))
    } else {
      throw createError(500, message.chapter.createFailed)
    }
  }
}

// READ CHAPTERS
/**
 * Lấy danh sách tất cả chương truyện.
 * @param {string} [sortBy='chapter_order'] - Trường sắp xếp.
 * @param {string} [order='ASC'] - Thứ tự sắp xếp.
 * @param {number} [page=1] - Số trang.
 * @param {number} [limit=10] - Số lượng bản ghi trên mỗi trang.
 * @returns {Promise<{data: Array, pagination: Object}>} - Dữ liệu chương và thông tin phân trang.
 */
async function getChapters(
  sortBy = 'chapter_order',
  order = 'ASC',
  page = 1,
  limit = 10,
  offset = 0,
) {
  const total = await Chapter.count()
  const data = await Chapter.findAll({
    order: [[sortBy, order]],
    limit: limit,
    offset: offset,
  })

  const pagination = {
    total: total,
    page: page,
    limit: limit,
    totalPages: Math.ceil(total / limit),
  }

  return { data, pagination }
}
// v

async function getChaptersByStory1(story_id, page, limit) {
  try {
    // Nếu page là một chuỗi rỗng, lấy tất cả dữ liệu mà không phân trang
    if (page === 0) {
      const rows = await Chapter.findAll({
        where: { story_id },
        order: [['chapter_order', 'ASC']], // Sắp xếp theo chapter_order (hoặc bất kỳ thứ tự nào bạn muốn)
      })

      return {
        chapters: rows,
        totalCount: rows.length,
        totalPages: 1, // Tổng số trang là 1 vì không phân trang
        currentPage: 1, // Trang hiện tại là 1
      }
    }

    // Nếu page không phải là chuỗi rỗng, thực hiện phân trang
    const offset = (page - 1) * limit

    const { rows, count } = await Chapter.findAndCountAll({
      where: { story_id },
      limit: limit,
      offset: offset,
      order: [['chapter_order', 'ASC']], // Sắp xếp theo chapter_order (hoặc bất kỳ thứ tự nào bạn muốn)
    })

    // Tính toán số trang
    const totalPages = Math.ceil(count / limit)

    return {
      chapters: rows,
      totalCount: count,
      totalPages: totalPages,
      currentPage: page,
    }
  } catch (error) {
    throw new Error('Error fetching chapters: ' + error.message)
  }
}

// Lấy danh sách tất cả chương truyện theo story_id
//nếu truyền vào all=true, không thì mặc định sẽ lấy tất cả truyện đã đăng (status=true)
// Lấy thông tin truyện và danh sách chương dựa trên story_id
// Nếu getAll=true, lấy tất cả chương, ngược lại mặc định chỉ lấy chương đã đăng (status=true)

async function getChaptersByStoryId(
  story_id,
  includeStory = true,
  getAll = false,
  sortBy = 'chapter_order',
  order = 'ASC',
  page = 1,
  limit = 10,
) {
  try {
    let story = null

    if (includeStory) {
      const storyInstance = await Story.findByPk(story_id, {
        attributes: [
          'id',
          'status',
          'author_id',
          'description',
          'story_name',
          'views',
          'slug',
          'cover',
          'created_at',
          'keywords',
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
          },
        ],
      })

      story = storyInstance.toJSON()
      if (!story) {
        throw createError('story not found')
      }
    }

    const whereStatement = getAll ? {} : { status: true }
    whereStatement.story_id = story_id

    const offset = (page - 1) * limit

    const total = await Chapter.count({ where: whereStatement })

    const chapters = await Chapter.findAll({
      where: whereStatement,
      attributes: [
        'id',
        'chapter_name',
        'views',
        'slug',
        'published_at',
        'created_at',
        'chapter_order',
        'status',
        'story_id',
      ],
      order: [[sortBy, order]],
      limit: limit,
      offset: offset,
    })

    const pagination = {
      total: total,
      page: page,
      limit: limit,
      totalPages: Math.ceil(total / limit),
    }
    if (includeStory) {
      story['totalChapters'] = total
    }
    return {
      story,
      chapters,
      pagination,
    }
  } catch (error) {
    console.error('Error fetching story and chapters:', error)
    throw new Error('Failed to fetch story and chapters')
  }
}

// SEARCH CHAPTERS
/**
 * Tìm kiếm chương theo từ khóa.
 * @param {string} keyword - Từ khóa tìm kiếm.
 * @param {string} [sortBy='chapter_order'] - Trường sắp xếp.
 * @param {string} [order='ASC'] - Thứ tự sắp xếp.
 * @param {number} [page=1] - Số trang.
 * @param {number} [limit=10] - Số lượng bản ghi trên mỗi trang.
 * @returns {Promise<{data: Array, pagination: Object}>} - Dữ liệu chương và thông tin phân trang.
 */
async function searchChapters(
  story_id,
  keyword,
  includeStory = true,
  sortBy = 'chapter_order',
  order = 'ASC',
  page = 1,
  limit = 10,
) {
  try {
    const offset = (page - 1) * limit
    let story = null

    // Kiểm tra nếu cần lấy thông tin của story
    if (includeStory) {
      story = await Story.findByPk(story_id, {
        attributes: [
          'id',
          'status',
          'author_id',
          'description',
          'story_name',
          'views',
          'slug',
          'cover',
          'created_at',
          'keywords',
        ],
        include: [
          {
            model: Author,
            attributes: ['author_name', 'id'],
          },
          {
            model: Genre,
            as: 'genres',
            attributes: ['id', 'genre_name'],
          },
        ],
      })

      if (!story) {
        throw new Error('Story not found')
      }
    }

    // Tạo điều kiện tìm kiếm
    const whereStatement = {
      [Op.and]: [
        { story_id },
        {
          [Op.or]: [
            { chapter_name: { [Op.like]: `%${keyword}%` } },
            { content: { [Op.like]: `%${keyword}%` } },
          ],
        },
      ],
    }

    // Đếm tổng số kết quả
    const total = await Chapter.count({ where: whereStatement })

    // Truy vấn danh sách chapters
    const chapters = await Chapter.findAll({
      where: whereStatement,
      attributes: [
        'id',
        'chapter_name',
        'views',
        'slug',
        'published_at',
        'created_at',
        'chapter_order',
        'status',
        'story_id',
      ],
      order: [[sortBy, order]],
      limit: limit,
      offset: offset,
    })

    // Tính toán phân trang
    const pagination = {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    }

    // Trả về kết quả
    return { story, chapters, pagination }
  } catch (error) {
    console.error('Error searching chapters:', error)
    throw new Error('Failed to search chapters')
  }
}

// GET CHAPTER BY ID
/**
 * Lấy thông tin chi tiết của một chương theo ID.
 * @param {number} id - ID của chương cần lấy thông tin.
 * @returns {Promise<Object|null>} - Trả về đối tượng chương hoặc null nếu không tìm thấy.
 */
async function getChapterByID(id) {
  return await Chapter.findByPk(id, {
    include: [
      {
        model: Story,
        attributes: ['story_name'],
      },
    ],
  })
}

// GET CHAPTER BY SLUG
/**
 * Lấy thông tin chi tiết của một chương theo slug.
 * @param {string} slug - Slug của chương cần lấy thông tin.
 * @returns {Promise<Object|null>} - Trả về đối tượng chương hoặc null nếu không tìm thấy.
 */
async function getChapterBySlug(slug) {
  const chapter = await Chapter.findOne({
    where: { slug },
    include: [
      {
        model: Story,
        attributes: ['id', 'story_name', 'slug'],
      },
    ],
    attributes: [
      'id',
      'chapter_name',
      'content',
      'slug',
      'story_id',
      'views',
      'chapter_order',
      'published_at',
    ],
  })

  if (!chapter) {
    throw createError(404, message.chapter.notFound)
  }
  return chapter
}

// UPDATE CHAPTER
/**
 * Cập nhật thông tin chương.
 * @param {number} id - ID của chương cần cập nhật.
 * @param {Object} updatedData - Đối tượng chứa dữ liệu cập nhật.
 * @returns {Promise<Object>} - Trả về đối tượng chương đã được cập nhật.
 */
async function updateChapter(id, updatedData) {
  try {
    const currentChapter = await Chapter.findByPk(id)
    if (!currentChapter) {
      throw createError(404, message.chapter.notFound)
    }
    const [affectedCount] = await Chapter.update(updatedData, {
      where: { id },
    })

    if (affectedCount === 0) {
      throw createError(400, message.generalErrors.NoUpdate)
    }

    return await Chapter.findByPk(id)
  } catch (error) {
    console.log(error)
    if (error.name === 'SequelizeValidationError') {
      throw createError(400, error.errors.map((err) => err.message).join(', '))
    } else {
      throw createError(500, message.chapter.updateFailed)
    }
  }
}

// DELETE CHAPTER
/**
 * Xóa một chương theo ID.
 * @param {number} id - ID của chương cần xóa.
 * @returns {Promise<void>} - Không trả về giá trị.
 */
async function deleteChapterById(id) {
  try {
    const chapter = await Chapter.findByPk(id)
    if (!chapter) {
      throw createError(404, message.chapter.notFound)
    }
    await chapter.destroy()
    return { success: true, message: message.chapter.deleteSuccess }
  } catch (error) {
    throw createError(
      error.status || error.statusCode || 500,
      message.chapter.deleteFailed,
    )
  }
}
async function deleteStoryId(storyId) {
  try {
    console.log(storyId)

    // Find the story by its ID to check if it exists
    // const story = await Story.findByPk(storyId);
    // if (!story) {
    //   // If the story is not found, throw a 404 error
    //   throw createError(404, message.story.notFound);
    // }

    // Find all chapters associated with the story_id
    const chapters = await Chapter.findAll({ where: { story_id: storyId } })

    if (chapters.length === 0) {
      // If no chapters are found for the story, return a message
      return { success: false, message: message.chapter.notFound }
    }

    // Delete all chapters associated with the story
    await Chapter.destroy({ where: { story_id: storyId } })

    // Return a success message
    return { success: true, message: message.chapter.deleteSuccess }
  } catch (error) {
    // Handle any errors that occur
    throw createError(500, message.chapter.deleteFailed)
  }
}
async function getChapterByStoryRead(
  story_id,
  sortBy = 'chapter_order',
  order = 'ASC',
) {
  try {
    console.log('Story ID:', story_id)

    // Kiểm tra nếu không có `story_id`
    if (!story_id) {
      throw new Error('Story ID không hợp lệ')
    }

    // Điều kiện lọc chapter theo `story_id`
    const whereStatement = { story_id }

    // Lấy danh sách chapters sắp xếp theo `chapter_order`
    const chapters = await Chapter.findAll({
      where: whereStatement,
      attributes: [
        'id',
        'chapter_name',
        'views',
        'slug',
        'published_at',
        'created_at',
        'chapter_order',
        'status',
        'story_id',
      ],
      order: [[sortBy, order]],
    })
    console.log(chapters)

    // Kiểm tra nếu không tìm thấy chapter nào
    if (!chapters || chapters.length === 0) {
      throw new Error('Không tìm thấy chapter nào cho truyện này')
    }

    // Trả về danh sách chapter
    return {
      chapters,
    }
  } catch (error) {
    console.error('Error fetching chapters:', error)
    throw new Error('Không thể lấy danh sách chapter')
  }
}

module.exports = {
  createChapter,
  getChapters,
  getChaptersByStoryId,
  getChapterByID,
  getChaptersByStory1,
  getChapterBySlug,
  updateChapter,
  deleteChapterById,
  searchChapters,
  deleteStoryId,
  getChapterByStoryRead,
}
