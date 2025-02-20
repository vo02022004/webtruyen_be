const multer = require('multer')
const MAX_SIZE = 5 * 1024 * 1024
const message = require('@root/message')

/** CONFIGUARATION STORAGE ENGINE
 *  Cấu hình nơi lưu trữ file, và cách đặt tên
 */
fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'src/uploads/images') /**  Nơi lưu file: src/uploads/images */
  },

  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname) /** đặt tên file */
  },
})
/** RETURN MIDDLEWARE TO HANDLE FILE SUBMITTED
 * Trả về middleware chứa các phương thức xử lý file được gửi lên,
 * Sử dụng middleware gồm 2 phương thức single('input_name') - xử lý 1 file được gửi lên
 * và array('input_name') - xử lý gửi lên nhiều files
 */

const upload = multer({
  storage: fileStorageEngine,
  limits: { fileSize: MAX_SIZE },
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype === 'image/jpeg' ||
      file.mimetype === 'image/png' ||
      file.mimetype === 'image/webp'
    ) {
      cb(null, true)
    } else {
      const error = new Error(message.user.formatError)
      error.statusCode = 415
      cb(error, false)
    }
  },
})

// Middleware để kiểm tra và trả về lỗi HTTP cụ thể
const uploadSingleFile = (input_name) => (req, res, next) => {
  upload.single(input_name)(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        err.statusCode = 413
        err.message = message.user.sizeError
      }
      return next(err)
    } else if (err) {
      return next(err)
    }
    next()
  })
}

module.exports = { uploadSingleFile }
