// const createHttpError = require('http-errors');
// const { registerUser } = require('@services/userregister.service'); // Sử dụng đúng import
// const message = require('@root/message');

// // ==========================
// // User Handler Functions
// // ==========================

// // CREATE USER
// /**
//  * Xử lý yêu cầu đăng ký người dùng mới.
//  * @param {Object} req - Đối tượng yêu cầu.
//  * @param {Object} res - Đối tượng phản hồi.
//  * @param {Function} next - Hàm gọi tiếp theo trong middleware.
//  */
// async function handleRegisterUser(req, res, next) {
//   const { username, email, password, confirmPassword } = req.body;

//   try {
//     // Gọi service registerUser để xử lý việc đăng ký người dùng
//     const result = await registerUser({ username, email, password, confirmPassword });

//     // Xử lý kết quả từ service
//     if (!result.success) {
//       // Trả về lỗi tương ứng nếu đăng ký không thành công
//       return res.status(result.success ? 200 : 400).json({
//         success: false,
//         message: result.message,
//       });
//     }

//     // Thành công, trả về thông tin người dùng
//     return res.status(201).json({
//       success: true,
//       status: 201,
//       message: result.message,
//       data: result.data,
//       links: [],
//     });
//   } catch (error) {
//     // Log thông tin lỗi để debug
//     console.error('Error in handleRegisterUser:', error);

//     // Xử lý các lỗi từ service
//     if (error.status === 400 || error.status === 409) {
//       return next(createHttpError(error.status, error.message)); // Lỗi từ service
//     }

//     // Lỗi khác
//     return next(createHttpError(500, 'Error registering user', { details: error.message }));
//   }
// }

// module.exports = {
//   handleRegisterUser,
// };
