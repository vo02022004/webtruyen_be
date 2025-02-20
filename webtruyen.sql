-- Xóa bảng nếu tồn tại trước khi tạo mới
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS role;
DROP TABLE IF EXISTS authors;
DROP TABLE IF EXISTS stories;
DROP TABLE IF EXISTS chapters;
DROP TABLE IF EXISTS genres;
DROP TABLE IF EXISTS tags;
DROP TABLE IF EXISTS comments;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS favorite_stories;
DROP TABLE IF EXISTS tag_story;
DROP TABLE IF EXISTS genre_story;

-- Tạo bảng roles 
CREATE TABLE role (
    id INT AUTO_INCREMENT PRIMARY KEY,
    role_name VARCHAR(30),
    description VARCHAR(255)
);

-- Tạo bảng users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    role_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    status BOOLEAN DEFAULT TRUE,
    avatar VARCHAR(255),
    UNIQUE (username(191)),
    UNIQUE (email(191))
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- Tạo bảng authors
CREATE TABLE authors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    author_name VARCHAR(255),
    description VARCHAR(255),
    slug VARCHAR(255)
);

-- Tạo bảng stories
CREATE TABLE stories (
    id INT AUTO_INCREMENT PRIMARY KEY,
    status INT,
    author_id INT,
    description TEXT,
    story_name VARCHAR(255),
    total_chapters INT DEFAULT 0,
    views INT DEFAULT 0,
    cover VARCHAR(255),
    keywords TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    slug VARCHAR(255)
);

-- Tạo bảng chapters
CREATE TABLE chapters (
    id INT AUTO_INCREMENT PRIMARY KEY,
    chapter_name VARCHAR(255),
    content TEXT,
    story_id INT,
    slug VARCHAR(255),
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    published_at TIMESTAMP,
    status BOOLEAN,
    chapter_order INT
);

-- Tạo bảng genres
CREATE TABLE genres (
    id INT AUTO_INCREMENT PRIMARY KEY,
    genre_name VARCHAR(255),
    description VARCHAR(255),
    slug VARCHAR(255)
);

-- Tạo bảng tags
CREATE TABLE tags (
    id INT AUTO_INCREMENT PRIMARY KEY,
    tag_name VARCHAR(255),
    tag_slug VARCHAR(255)
);

-- Tạo bảng comments
CREATE TABLE comments (
    user_id INT,
    chapter_id INT,
    content TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, chapter_id)
);

-- Tạo bảng reviews
CREATE TABLE reviews (
    user_id INT,
    story_id INT,
    star INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    comment TEXT,
    PRIMARY KEY (user_id, story_id)
);

-- Tạo bảng favorite_stories
CREATE TABLE favorite_stories (
    user_id INT,
    story_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, story_id)
);

-- Tạo bảng tag_story
CREATE TABLE tag_story (
    tag_id INT,
    story_id INT,
    description TEXT,
    PRIMARY KEY (tag_id, story_id)
);

-- Tạo bảng genre_story
CREATE TABLE genre_story (
    genre_id INT,
    story_id INT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (genre_id, story_id)
);

-- Chèn dữ liệu vào bảng roles
INSERT INTO role (role_name, description) VALUES
('Admin', 'Quản trị viên'),
('User', 'Người dùng');

-- Chèn dữ liệu vào bảng users
INSERT INTO users (username, email, password, role_id, avatar) VALUES
('admin1', 'admin@example.com', 'password1', 1, 'avatar1.png'),
('user1', 'user1@example.com', 'password2', 2, 'avatar2.png'),
('user2', 'user2@example.com', 'password3', 2, 'avatar3.png'),
('user3', 'user3@example.com', 'password4', 2, 'avatar4.png'),
('user4', 'user4@example.com', 'password5', 2, 'avatar5.png'),
('user5', 'user5@example.com', 'password6', 2, 'avatar6.png'),
('user6', 'user6@example.com', 'password7', 2, 'avatar7.png'),
('user7', 'user7@example.com', 'password8', 2, 'avatar8.png'),
('user8', 'user8@example.com', 'password9', 2, 'avatar9.png'),
('user9', 'user9@example.com', 'password10', 2, 'avatar10.png');

-- Chèn dữ liệu vào bảng authors
INSERT INTO authors (author_name, description, slug) VALUES
('Author One', 'Description for author one', 'author-one'),
('Author Two', 'Description for author two', 'author-two'),
('Author Three', 'Description for author three', 'author-three'),
('Author Four', 'Description for author four', 'author-four'),
('Author Five', 'Description for author five', 'author-five'),
('Author Six', 'Description for author six', 'author-six'),
('Author Seven', 'Description for author seven', 'author-seven'),
('Author Eight', 'Description for author eight', 'author-eight'),
('Author Nine', 'Description for author nine', 'author-nine'),
('Author Ten', 'Description for author ten', 'author-ten');

-- Chèn dữ liệu vào bảng stories
INSERT INTO stories (status, author_id, description, story_name, total_chapters, views, cover, keywords, slug) VALUES
(1, 1, 'Story description 1', 'Story One', 3, 100, 'cover1.jpg', 'keyword1, keyword2', 'story-one'),
(1, 2, 'Story description 2', 'Story Two', 2, 200, 'cover2.jpg', 'keyword3, keyword4', 'story-two'),
(1, 3, 'Story description 3', 'Story Three', 5, 150, 'cover3.jpg', 'keyword5, keyword6', 'story-three'),
(1, 1, 'Story description 4', 'Story Four', 1, 50, 'cover4.jpg', 'keyword7, keyword8', 'story-four'),
(1, 2, 'Story description 5', 'Story Five', 4, 75, 'cover5.jpg', 'keyword9, keyword10', 'story-five'),
(0, 3, 'Story description 6', 'Story Six', 0, 0, 'cover6.jpg', 'keyword11, keyword12', 'story-six'),
(1, 1, 'Story description 7', 'Story Seven', 2, 300, 'cover7.jpg', 'keyword13, keyword14', 'story-seven'),
(1, 2, 'Story description 8', 'Story Eight', 3, 400, 'cover8.jpg', 'keyword15, keyword16', 'story-eight'),
(1, 3, 'Story description 9', 'Story Nine', 1, 500, 'cover9.jpg', 'keyword17, keyword18', 'story-nine'),
(0, 1, 'Story description 10', 'Story Ten', 0, 0, 'cover10.jpg', 'keyword19, keyword20', 'story-ten');

-- Chèn dữ liệu vào bảng chapters
INSERT INTO chapters (chapter_name, content, story_id, slug, views, status, chapter_order) VALUES
('Chapter 1 of Story One', 'Content for chapter 1 of story one', 1, 'chapter-1-story-one', 50, TRUE, 1),
('Chapter 2 of Story One', 'Content for chapter 2 of story one', 1, 'chapter-2-story-one', 30, TRUE, 2),
('Chapter 1 of Story Two', 'Content for chapter 1 of story two', 2, 'chapter-1-story-two', 60, TRUE, 1),
('Chapter 1 of Story Three', 'Content for chapter 1 of story three', 3, 'chapter-1-story-three', 40, TRUE, 1),
('Chapter 2 of Story Three', 'Content for chapter 2 of story three', 3, 'chapter-2-story-three', 20, TRUE, 2),
('Chapter 1 of Story Four', 'Content for chapter 1 of story four', 4, 'chapter-1-story-four', 10, TRUE, 1),
('Chapter 1 of Story Five', 'Content for chapter 1 of story five', 5, 'chapter-1-story-five', 80, TRUE, 1),
('Chapter 1 of Story Six', 'Content for chapter 1 of story six', 6, 'chapter-1-story-six', 0, FALSE, 1),
('Chapter 1 of Story Seven', 'Content for chapter 1 of story seven', 7, 'chapter-1-story-seven', 100, TRUE, 1),
('Chapter 1 of Story Eight', 'Content for chapter 1 of story eight', 8, 'chapter-1-story-eight', 150, TRUE, 1);

-- Chèn dữ liệu vào bảng genres
INSERT INTO genres (genre_name, description, slug) VALUES
('Action', 'Action genre description', 'action'),
('Adventure', 'Adventure genre description', 'adventure'),
('Romance', 'Romance genre description', 'romance'),
('Fantasy', 'Fantasy genre description', 'fantasy'),
('Horror', 'Horror genre description', 'horror');

-- Chèn dữ liệu vào bảng tags
INSERT INTO tags (tag_name, tag_slug) VALUES
('Epic', 'epic'),
('Mystery', 'mystery'),
('Supernatural', 'supernatural'),
('Comedy', 'comedy'),
('Tragic', 'tragic');

-- Chèn dữ liệu vào bảng comments
INSERT INTO comments (user_id, chapter_id, content) VALUES
(1, 1, 'This is a comment for chapter 1 of story one'),
(2, 2, 'This is a comment for chapter 2 of story one'),
(3, 3, 'This is a comment for chapter 1 of story two'),
(4, 4, 'This is a comment for chapter 1 of story three'),
(5, 5, 'This is a comment for chapter 2 of story three');

-- Chèn dữ liệu vào bảng reviews
INSERT INTO reviews (user_id, story_id, star, comment) VALUES
(1, 1, 5, 'Great story, loved it!'),
(2, 2, 4, 'Nice story, very engaging.'),
(3, 3, 3, 'Good, but could be better.'),
(4, 4, 5, 'Amazing plot, highly recommend!'),
(5, 5, 2, 'Not my type of story.');

-- Chèn dữ liệu vào bảng favorite_stories
INSERT INTO favorite_stories (user_id, story_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

-- Chèn dữ liệu vào bảng tag_story
INSERT INTO tag_story (tag_id, story_id, description) VALUES
(1, 1, 'Epic story one'),
(2, 2, 'Mystery in story two'),
(3, 3, 'Supernatural elements in story three'),
(4, 4, 'Comedy in story four'),
(5, 5, 'Tragic ending in story five');

-- Chèn dữ liệu vào bảng genre_story
INSERT INTO genre_story (genre_id, story_id) VALUES
(1, 1),
(2, 2),
(3, 3),
(4, 4),
(5, 5);

