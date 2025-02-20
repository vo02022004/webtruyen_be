// const createHttpError = require('http-errors');
// const { loginUser } = require('@services/userlogin.service');

// const { JWT_SECRET } = process.env; // Lấy JWT secret từ biến môi trường

// // ==========================
// // Xử lý Đăng Nhập
// // ==========================
// async function handleLoginUser(req, res, next) {
//   const { username, password } = req.body;

//   try {
//     // Gọi service loginUser để xử lý đăng nhập
//     const result = await loginUser(username, password);

//     // Kiểm tra kết quả từ service và phản hồi
//     if (!result.success) {
//       // Trả về lỗi nếu đăng nhập không thành công
//       return res.status(400).json({
//         success: false,
//         message: result.message,
//       });
//     }

//     // Trả về kết quả đăng nhập thành công
//     return res.status(200).json(result);
//   } catch (error) {
//     console.error(error);
//     return next(createHttpError(500, 'Lỗi khi đăng nhập'));
//   }
// }

// module.exports = {
//   handleLoginUser,
// };
