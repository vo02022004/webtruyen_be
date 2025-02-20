const express = require('express')
const router = express.Router()
const storiesController = require('../controllers/story.Controller')

// const { uploadSingleFile } = require("../middlewares/upload.middleware");

// // Routes for managing stories
// router.post(
//   "/create",
//   uploadSingleFile("cover"),
//   storiesController.createStory
// );
// router.get("/", storiesController.getStories);
// // v
router.get('/getAllStorieView', storiesController.getAllStorieView)
// // v
router.get('/getAllStorieNew', storiesController.getAllStorieNew)
router.get('/:id', storiesController.getStoryById)
// // v
router.get('/getStoryBySlug/:slug', storiesController.getStoryBySlug)
// router.put(
//   "/update/:id",
//   uploadSingleFile("cover"),
//   storiesController.updateStory
// );

const { uploadSingleFile } = require('../middlewares/upload.middleware')

// Routes for managing stories
router.post("/:id/increment-views", storiesController.incrementViews);

router.post('/create', uploadSingleFile('cover'), storiesController.createStory)
router.get('/', storiesController.getStories)
router.get('/:id', storiesController.getStoryById)
router.get('/search/:keyword', storiesController.handleSearchStories)
router.put(
  '/update/:id',
  uploadSingleFile('cover'),
  storiesController.updateStory,
)

router.delete('/delete/:id', storiesController.deleteStory)

// New route to fetch chapters for a specific story by story_id
router.get('/:story_id/chapters', storiesController.getChaptersByStory)

// (Optional/Commented) Route to fetch a specific chapter using slugs for story and chapter
// router.get('/:slugStory/:slugChapter', storiesController.getChapterBySlug)

// Tài
// Định nghĩa route để lấy danh sách các stories theo genreSlug
router.get('/genre/:slug', storiesController.getStoriesByGenre)

module.exports = router
