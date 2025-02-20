// routes/chapter.router.js
const express = require('express')
const {
  handleCreateChapter,
  handleUpdateChapter,
  handleDeleteChapter,
  getChaptersByStory,
  handleGetChapterById,
  getChaptersBySlug,
  getChaptersByStoryAll,
  HandelgetChaptersByStoryId,
  handleDeleteStoryId,
} = require('@controllers/chapter.controller')
const router = express.Router()

//===================
// Chapter Create API Endpoint
//===================
router.post('/', handleCreateChapter)
// v
router.get('/chapterByStory', getChaptersByStory)
router.get('/chapterByStory', getChaptersByStoryAll)

router.get('/:id', handleGetChapterById)
//===================
// Chapter Read API Endpoints
//===================
router.get('/getChapterByslug/:slug', getChaptersBySlug)
router.get('/getstory/:id', HandelgetChaptersByStoryId)

//===================
// Chapter Update API Endpoint
//===================
router.patch('/:id', handleUpdateChapter)

//===================
// Chapter Delete API Endpoint
//===================
router.delete('/:id', handleDeleteChapter)
router.delete('/handleDeleteStoryId/:id', handleDeleteStoryId)

module.exports = router
// GET /stories/:story_id/chapters - Lấy danh sách tất cả các chương của một truyện
// router.get('/:story_id/chapters', handleGetChapters)
// GET /chapters/:slug -  người dùng nhập slug-truyen/slug-chuong để xem một chương cụ thể
