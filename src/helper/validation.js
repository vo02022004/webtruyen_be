//==================Validation API==================//

const Joi = require('joi')
const message = require('@root/message.js')
/** USER'S VALIDATION FUNCTION
 * Kiểm tra tạo người dùng và chỉnh sửa ngườid dùng
 * @param {Object} data
 * @param {Boolean} isEdit
 * @returns
 */
const userValidate = (data, isEdit = false) => {
  const joiObject = {
    username: Joi.string().min(1).max(255).required().messages({
      'any.required': message.user.usernameRequired,
      'string.pattern.base': message.user.usernameSpecialChars,
    }),
    email: Joi.string().email().required().max(255).messages({
      'any.required': message.user.emailRequired,
      'string.max': message.user.emailLength,
    }),
    avatar: Joi.string().required().messages({
      'any.required': message.user.coverImageRequired,
    }),
    role_id: Joi.number().required().messages({
      'number.base': message.user.roleNotFound,
    }),
    status: Joi.boolean().required().messages({
      'boolean.base': message.user.statusNotFound,
    }),
  }
  if (!isEdit) {
    joiObject.password = Joi.string().min(1).max(255).messages({
      'any.required': message.user.passwordRequired,
      'string.pattern.base': message.user.passwordStrength,
    })
    joiObject.confirmPassword = Joi.string()
      .valid(Joi.ref('password'))
      .required()
      .messages({
        'any.required': message.user.passwordRequired,
        'string.pattern.base': message.user.passwordStrength,
        'any.only': message.user.passwordsDoNotMatch,
      })
  }
  const userSchema = Joi.object(joiObject).optional()
  return userSchema.validate(data)
}

/** USER'S LOGIN VALIDATION
 * Kiểm tra thông tin đăng nhập
 * @param {Object} data
 * @returns
 */
const loginValidate = (data) => {
  const rule = Joi.object({
    email: Joi.string().required().messages({
      'any.required': message.auth.emailRequired,
    }),
    password: Joi.string().required().messages({
      'any.required': message.auth.passwordRequired,
    }),
  })
  return rule.validate(data)
}
/** USER'S REGISTER VALIDATION
 * Kiểm tra thông tin đăng nhập
 * @param {Object} data
 * @returns
 */
const registerValidate = (data) => {
  const rule = Joi.object({
    username: Joi.string().required().messages({
      'any.required': message.auth.emailRequired,
    }),
    email: Joi.string().required().messages({
      'any.required': message.auth.emailRequired,
    }),
    password: Joi.string().required().messages({
      'any.required': message.auth.passwordRequired,
    }),
    confirmPassword: Joi.string().required().messages({
      'any.required': message.auth.passwordRequired,
    }),
  })

  return rule.validate(data)
}

/** USER'S PROFILE VALIDATION
 * Kiểm tra thông tin cập nhật mật khẩu
 * @param {Object} data
 * @returns
 */
const updateProfilePassword = (data) => {
  if (data.currentPassword === data.newPassword) {
    const error = new Error(message.auth.passwordCannotBeSame)
    return { error }
  }
  const rule = Joi.object({
    // Mật khẩu hiện tại
    currentPassword: Joi.string().required().messages({
      'any.required': message.auth.currentPasswordRequired,
      'string.pattern.base': message.auth.currentPasswordRequired,
    }),

    // Mật khẩu mới
    newPassword: Joi.string()
      .min(8)
      .pattern(new RegExp('^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d).+$'))
      .required()
      .messages({
        'string.pattern.base': message.user.passwordStrength,
        'any.required': message.auth.passwordRequired,
      }),

    // Xác nhận mật khẩu
    confirmPassword: Joi.string()
      .valid(Joi.ref('newPassword'))
      .required()
      .messages({
        'any.required': message.auth.passwordRequired,
        'any.only': message.user.passwordsDoNotMatch,
      }),
  })

  return rule.validate(data)
}

/** CHAPTER'S VALIDATION FUNCTION
 * Kiểm tra tạo và chỉnh sửa chương truyện
 * @param {Object} data
 * @param {Boolean} isEdit
 * @returns
 */
const chapterValidate = (data, isEdit = false) => {
  const joiObject = {
    chapter_name: Joi.string()
      .min(1)
      .max(255)
      // .pattern(/^[a-zA-Z0-9\s]*$/)
      .pattern(/^[\p{L}\p{N}\s]*$/u)
      .required()
      .messages({
        'any.required': message.chapter.chapterNameRequired,
        'string.empty': message.chapter.chapterNameRequired,
        'string.max': message.chapter.chapterNameLength,
        'string.pattern.base': message.chapter.chapterNameSpecialChars,
      }),
    content: Joi.string().required().messages({
      'any.required': message.chapter.contentRequired,
      'string.empty': message.chapter.contentRequired,
    }),
    story_id: Joi.number().required().messages({
      'any.required': message.chapter.storyNotFound,
      'number.base': message.chapter.storyNotFound,
    }),
    chapter_order: Joi.number().positive().required().messages({
      'any.required': message.chapter.chapterOrderRequired,
      'number.base': message.chapter.chapterOrderInvalid,
      'number.positive': message.chapter.chapterOrderInvalid,
    }),
    status: Joi.boolean().required().messages({
      'any.required': message.chapter.statusRequired,
      'boolean.base': message.chapter.statusInvalid,
    }),
    slug: Joi.string()
      .max(255)
      .required()
      .pattern(/^[^\s]+$/)
      .messages({
        'any.required': message.chapter.slugRequired,
        'string.max': message.chapter.slugLength,
        'string.pattern.base': message.chapter.slugInvalid,
      }),
  }

  // Nếu là chế độ chỉnh sửa, có thể thêm kiểm tra cho `id` hoặc `slug` nếu cần
  if (isEdit) {
    joiObject.id = Joi.number().required().messages({
      'any.required': message.chapter.editNotFound,
    })
  }

  const chapterSchema = Joi.object(joiObject)
  return chapterSchema.validate(data)
}

/**
 * Hàm validate dữ liệu review.
 * @param {Object} data - Dữ liệu của review cần kiểm tra.
 * @returns {Object} - Kết quả kiểm tra, chứa lỗi (nếu có).
 */
const reviewValidate = (data) => {
  const joiObject = {
    user_id: Joi.number().integer().positive().required().messages({
      'any.required': message.review.userIdRequired,
      'number.base': message.review.userIdInvalid,
      'number.integer': message.review.userIdInvalid,
      'number.positive': message.review.userIdInvalid,
    }),

    story_id: Joi.number().integer().required().messages({
      'any.required': message.review.storyIdRequired,
      'number.base': message.review.storyIdInvalid,
      'number.integer': message.review.storyIdInvalid,
    }),

    star: Joi.number().integer().min(1).max(10).required().messages({
      'any.required': message.review.starRequired,
      'number.base': message.review.starRequired,
      'number.integer': message.review.starInvalid,
      'number.min': message.review.starRange,
      'number.max': message.review.starRange,
    }),

    comment: Joi.string().optional().max(255).messages({
      'string.max': message.review.commentLength,
    }),
  }
  const reviewSchema = Joi.object(joiObject)
  return reviewSchema.validate(data)
}
module.exports = { reviewValidate }
module.exports = {
  userValidate,
  chapterValidate,
  loginValidate,
  registerValidate,
  reviewValidate,
  updateProfilePassword,
}
