const authorService = require('../services/author.service');
const message = require('../../message');

// Tạo tác giả mới
const createAuthor = async (req, res) => {
    try {
        const { author_name, description, slug } = req.body;
        console.log("check create", req);

        const newAuthor = await authorService.createAuthor({ author_name, description, slug });
        res.status(201).json({ message: message.author.createSuccess, author: newAuthor });
    } catch (error) {
        res.status(400).json({ message: message.author.createFailed, error });
    }
};

// Lấy danh sách tất cả tác giả
const getAllAuthorsName = async (req, res) => {
    console.log("kiểm tra tham số", req.query);

    try {
        const authors = await authorService.getAllAuthorsName();
        res.status(200).json({
            success: message.author.fetchSuccess
            , data: authors
        });
    } catch (error) {
        res.status(500).json({ message: message.author.error, error });
    }
};
const getAllAuthors = async (req, res) => {
    console.log("kiểm tra tham số", req.query);

    try {
        const { author_name, description, sortBy, sort, page, limit = 10 } = req.query; // Mặc định trang đầu tiên và giới hạn 10 hàng

        const { authors, totalCount, totalPages, currentPage } = await authorService.getAllAuthors(author_name, description, sortBy, sort, page, limit);
        res.status(200).json({
            success: message.author.fetchSuccess,
            totalCount: totalCount
            , totalPages: totalPages,
            currentPage: currentPage
            , data: authors
        });
    } catch (error) {
        res.status(500).json({ message: message.author.error, error });
    }
};


// Lấy chi tiết một tác giả
const getAuthorById = async (req, res) => {
    console.log("check get one");

    try {
        const author = await authorService.getAuthorById(req.params.id);
        console.log(req);

        if (!author) return res.status(404).json({ message: message.author.notFound });
        res.status(200).json({
            message: message.author.fetchSuccess,
            data: author
        });
    } catch (error) {
        res.status(400).json({ message: message.author.notFound, error });
    }
};

// Cập nhật tác giả
const updateAuthor = async (req, res) => {
    try {
        const { author_name, description, slug } = req.body;
        const updatedAuthor = await authorService.updateAuthor(req.params.id, { author_name, description, slug });
        if (!updatedAuthor[0]) return res.status(404).json({ message: "không có sự thay đổi" });
        res.status(200).json({
            message: message.author.updateSuccess,
            data: updatedAuthor
        });
    } catch (error) {
        res.status(400).json({ message: message.author.updateFailed, error });
    }
};

// Xóa tác giả
const deleteAuthor = async (req, res) => {
    try {
        const deletedAuthor = await authorService.deleteAuthor(req.params.id);
        if (!deletedAuthor) return res.status(404).json({ message: message.author.notFound });
        res.status(200).json({ message: message.author.deleteSuccess });
    } catch (error) {
        res.status(400).json({ message: message.author.deleteFailed, error });
    }
};


// const getAuthorWithStories = async (req, res) => {
//     const { slug } = req.params;  // Lấy slug từ URL
//     let { page, limit } = req.query; // Lấy page và limit từ query params
  
//     // Kiểm tra và gán giá trị mặc định cho page và limit nếu chưa được cung cấp
//     page = parseInt(page, 10) || 1;   // Nếu page không hợp lệ, mặc định là 1
//     limit = parseInt(limit, 10) || 10; // Nếu limit không hợp lệ, mặc định là 10
  
//     // In thông tin request (debugging purposes)
//     console.log(`Request params:`, req.params);
//     console.log(`Request query:`, req.query);
  
//     try {
//       // Gọi dịch vụ lấy tác giả và các câu chuyện (có phân trang)
//       const { author, totalPages } = await authorService.getAuthorWithStories(slug, page, limit);
  
//       // Kiểm tra xem có tìm thấy tác giả không
//       if (!author) {
//         return res.status(404).json({ message: 'Author not found' });
//       }
  
//       // Kiểm tra xem totalPages có hợp lệ không (nếu không trả về 0)
//       const pages = totalPages || 0;
  
//       // Xử lý stories và genres
//       const stories = author.stories.map(story => ({
//         story_id: story.id,
//         story_name: story.story_name,
//         story_slug: story.slug,
//         cover: story.cover,
//         total_chapters: story.total_chapters,
//         genres: story.genres.map(genre => ({
//           genre_name: genre.genre_name,
//           genre_slug: genre.slug
//         }))
//       }));
  
//       // Trả về dữ liệu của tác giả và các câu chuyện
//       return res.status(200).json({
//         message: true,
//         totalPages: pages,  // Trả về tổng số trang
//         data: {
//           author: {
//             id: author.id,
//             author_name: author.author_name,
//             slug: author.slug,
//             description: author.description,
//             stories // Đưa vào danh sách câu chuyện đã xử lý
//           }
//         }
//       });
//     } catch (error) {
//       // In lỗi để debug và trả về thông báo lỗi rõ ràng
//       console.error('Error fetching author with stories:', error);
  
//       // Trả về lỗi chi tiết hơn thay vì "Internal Server Error"
//       return res.status(500).json({
//         message: 'Internal Server Error',
//         error: error.message || error // Trả về chi tiết lỗi nếu có
//       });
//     }
//   };
const getAuthorWithStories = async (req, res) => { 
    const { slug } = req.params;  // Lấy slug từ URL
    let { page, limit } = req.query; // Lấy page và limit từ query params
  
    // Kiểm tra và gán giá trị mặc định cho page và limit nếu chưa được cung cấp
    page = parseInt(page, 10) || 1;   // Nếu page không hợp lệ, mặc định là 1
    limit = parseInt(limit, 10) || 2; // Nếu limit không hợp lệ, mặc định là 10
  
    // In thông tin request (debugging purposes)
    console.log(`Request params:`, req.params);
    console.log(`Request query:`, req.query);
  
    try {
      // Gọi dịch vụ lấy tác giả và các câu chuyện (có phân trang)
      const { author, totalPages, totalStories } = await authorService.getAuthorWithStories(slug, page, limit);
  
      // Kiểm tra xem có tìm thấy tác giả không
      if (!author) {
        return res.status(404).json({ message: 'Author not found' });
      }
  
      // Kiểm tra xem totalPages có hợp lệ không (nếu không trả về 0)
      const pages = totalPages || 0;
  
      // Tính toán các trang trước và sau để hiển thị thanh phân trang
      const pagination = {
        currentPage: page,
        totalPages: totalPages, // Đảm bảo trả về totalPages đúng cách
        hasNext: page < totalPages,
        hasPrevious: page > 1,
        nextPage: page + 1 <= totalPages ? page + 1 : null,
        previousPage: page - 1 >= 1 ? page - 1 : null
      };
  
      // Xử lý stories và genres
      const stories = author.stories.map(story => ({
        story_id: story.id,
        story_name: story.story_name,
        story_slug: story.slug,
        cover: story.cover,
        total_chapters: story.total_chapters,
        genres: story.genres.map(genre => ({
          genre_name: genre.genre_name,
          genre_slug: genre.slug
        }))
      }));
  
      // Trả về dữ liệu của tác giả, câu chuyện, và phân trang
      return res.status(200).json({
        message: true,
        totalPages, // Trả về tổng số trang từ backend
        pagination, // Trả về thông tin phân trang
        data: {
          author: {
            id: author.id,
            author_name: author.author_name,
            slug: author.slug,
            description: author.description,
            totalPages,
            stories // Đưa vào danh sách câu chuyện đã xử lý
          }
        }
      });
    } catch (error) {
      // In lỗi để debug và trả về thông báo lỗi rõ ràng
      console.error('Error fetching author with stories:', error);
  
      // Trả về lỗi chi tiết hơn thay vì "Internal Server Error"
      return res.status(500).json({
        message: 'Internal Server Error',
        error: error.message || error // Trả về chi tiết lỗi nếu có
      });
    }
  };
  
  
  


// src/controllers/authorController.js




module.exports = {
  getAuthorWithStories,
};

  
  module.exports = { getAuthorWithStories };
  
  

// routes.js - API để trả về tác giả và các truyện theo phân trang

  

module.exports = {
    createAuthor,
    getAllAuthors,
    getAuthorById,
    updateAuthor,
    deleteAuthor,
    getAllAuthorsName,
    getAuthorWithStories
};
