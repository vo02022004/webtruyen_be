const createHttpError = require('http-errors')
const {
  createChapter,
  getChapterByID,
  updateChapter,
  deleteChapterById,
  getChapterBySlug,
  getChaptersByStoryId,
  getChaptersByStory1,
  deleteStoryId,
  getChapterByStoryRead
} = require("@services/chapter.service");
const message = require("@root/message");
const { chapterValidate } = require("@helper/validation");

// ================================================
//              Chapter Handler Functions
// ================================================

// CREATE CHAPTER
async function handleCreateChapter(req, res, next) {
  const {
    chapter_name,
    content,
    story_id,
    slug,
    views,
    status,
    chapter_order,
  } = req.body

  const { error } = chapterValidate(req.body)
  if (error) {
    return next(createHttpError.BadRequest(error.message))
  }

  let published_at = status ? new Date().toISOString() : null

  try {
    const newChapter = await createChapter({
      chapter_name,
      content,
      story_id,
      slug,
      views,
      status,
      chapter_order,
      published_at,
    })

    return res.status(201).json({
      success: true,
      status: 201,
      message: message.chapter.createSuccess,
      data: newChapter,
      links: [],
    })
  } catch (error) {
    console.log(error)
    next(error)
  }
}
// READ CHAPTERS
async function getChaptersBySlug(req, res) {
  try {
    console.log(req)

    // Lấy tham số từ query string
    const { slug } = req.params
    console.log(slug)

    console.log('Check query parameters:', req.params)

    // Kiểm tra nếu story_id, page, và limit hợp lệ
    if (!slug) {
      return res.status(400).json({ message: 'khong tim thay url' })
    }
    const chapter = await getChapterBySlug(slug)

    // Trả về danh sách chương theo story_id
    res.status(200).json({
      success: true,
      message: 'lay du lieu thanh cong',
      data: chapter,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Error fetching chapters',
      error: error.message,
    })
  }
}
async function getChaptersByStory(req, res) {
  try {
    // Lấy tham số từ query string
    const { story_id, page, limit = 10 } = req.query
    console.log('Check query parameters:', req.query)

    // Kiểm tra nếu story_id, page, và limit hợp lệ
    if (!story_id) {
      return res.status(400).json({ message: 'Story ID is required' })
    }

    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)

    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({ message: 'Invalid page number' })
    }

    if (isNaN(limitNumber) || limitNumber < 1) {
      return res.status(400).json({ message: 'Invalid limit number' })
    }

    // Gọi hàm getChapters với các tham số để lấy danh sách chương theo story_id, phân trang và sắp xếp
    const { chapters, totalCount, totalPages, currentPage } =
      await getChaptersByStory1(story_id, pageNumber, limitNumber)

    // Trả về danh sách chương theo story_id
    res.status(200).json({
      message: 'Chapters fetched successfully',
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: currentPage,
      chapters: chapters,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Error fetching chapters',
      error: error.message,
    })
  }
}
async function getChaptersByStoryAll(req, res) {
  try {
    // Lấy tham số từ query string
    const { story_id, page, limit = 10 } = req.query
    console.log('Check query parameters:', req.query)

    // Kiểm tra nếu story_id, page, và limit hợp lệ
    if (!story_id) {
      return res.status(400).json({ message: 'Story ID is required' })
    }

    const pageNumber = parseInt(page, 10)
    const limitNumber = parseInt(limit, 10)

    if (isNaN(pageNumber) || pageNumber < 1) {
      return res.status(400).json({ message: 'Invalid page number' })
    }

    if (isNaN(limitNumber) || limitNumber < 1) {
      return res.status(400).json({ message: 'Invalid limit number' })
    }

    // Gọi hàm getChapters với các tham số để lấy danh sách chương theo story_id, phân trang và sắp xếp
    const { chapters, totalCount, totalPages, currentPage } =
      await getChaptersByStory1(story_id, pageNumber, limitNumber)

    // Trả về danh sách chương theo story_id
    res.status(200).json({
      message: 'Chapters fetched successfully',
      totalCount: totalCount,
      totalPages: totalPages,
      currentPage: currentPage,
      chapters: chapters,
    })
  } catch (error) {
    console.error(error)
    res.status(500).json({
      message: 'Error fetching chapters',
      error: error.message,
    })
  }
}

// GET CHAPTER BY ID
async function handleGetChapterById(req, res, next) {
  try {
    const id = req.params.id
    const chapter = await getChapterByID(id)
    if (!chapter) {
      return next(createHttpError(404, message.chapter.notFound))
    }
    return res.status(200).json({
      success: true,
      status: 200,
      message: message.chapter.fetchSuccess,
      data: chapter,
      links: [],
    })
  } catch (error) {
    next(error)
  }
}
async function HandelgetChaptersByStoryId(req, res) {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ success: false, message: 'Story ID is required' });
    }

    const { chapters } = await getChapterByStoryRead(id, true, 'chapter_order', 'ASC');
    if (!chapters || chapters.length === 0) {
      return res.status(404).json({ success: false, message: 'No chapters found' });
    }

    res.status(200).json({
      success: true,
      message: 'Fetched chapters successfully',
      data: { chapters },
    });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch story and chapters',
      error: error.message,
    });
  }
}

async function HandelgetAllChapter(req, res) {
  try {
    // Lấy tham số từ request params
    const { id } = req.params
    console.log('Story ID:', id)

    // Kiểm tra nếu id không hợp lệ
    if (!id) {
      return res.status(400).json({ message: 'Không tìm thấy story ID' })
    }

    // Gọi hàm getChaptersByStoryId1 để lấy dữ liệu chương
    const { data } = await getChaptersByStoryId(id) // Đảm bảo getChaptersByStoryId1 trả về { data }

    // Nếu không tìm thấy chương nào, trả về lỗi
    if (!data || data.length === 0) {
      return res.status(404).json({ message: 'Không tìm thấy chương nào' })
    }

    // Trả về kết quả nếu tìm thấy
    res.status(200).json({
      success: true,
      message: 'Lấy dữ liệu thành công',
      data: data, // Trả về dữ liệu các chương
    })
  } catch (error) {
    console.error('Error:', error)
    res.status(500).json({
      message: 'Lấy chapter thất bại',
      error: error.message,
    })
  }
}

// UPDATE CHAPTER BY ID
async function handleUpdateChapter(req, res, next) {
  try {
    const id = req.params.id
    const {
      chapter_name,
      content,
      story_id,
      slug,
      views,
      status,
      chapter_order,
    } = req.body

    const { error } = chapterValidate(
      {
        id,
        chapter_name,
        content,
        story_id,
        slug,
        status,
        chapter_order,
      },
      true,
    ) // true to indicate that it's an update

    if (error) {
      return next(error)
    }
    console.log('status>>', typeof status)
    let published_at = status == 'true' ? new Date().toISOString() : null
    console.log('>>publish: ', published_at)
    const updatedChapter = await updateChapter(id, {
      chapter_name,
      content,
      story_id,
      slug,
      views,
      status,
      chapter_order,
      published_at,
    })

    return res.status(200).json({
      success: true,
      status: 200,
      message: message.chapter.updateSuccess,
      data: updatedChapter,
      links: [],
    })
  } catch (error) {
    next(error)
  }
}

// DELETE CHAPTER
async function handleDeleteChapter(req, res, next) {
  const id = req.params.id
  try {
    const result = await deleteChapterById(id)
    if (result.error) {
      return next(result.error)
    }
    return res.status(200).json({
      success: true,
      message: message.chapter.deleteSuccess,
      status: 200,
      data: [],
      links: [],
    })
  } catch (error) {
    return next(error)
  }
}
async function handleDeleteStoryId(req, res, next) {
  const id = req.params.id;
  try {
    const result = await deleteStoryId(id);
    if (result.error) {
      return next(result.error);
    }

    return res.status(200).json({
      success: true,
      message: message.chapter.deleteSuccess,
      status: 200,
      data: [],
      links: [],
    });
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  handleCreateChapter,
  handleDeleteChapter,
  handleUpdateChapter,
  getChaptersByStory,
  getChaptersBySlug,
  getChaptersByStoryAll,
  HandelgetChaptersByStoryId,
  HandelgetAllChapter,
  handleDeleteStoryId,
  handleGetChapterById,
}
