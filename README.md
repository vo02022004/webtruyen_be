# webtruyen_nhomk_be

Dự án back-end dành cho web truyện, trả về API cho front-end nextjs

## Chuẩn bị môi trường

- nodejs, npm
- tải file .env từ nhóm trưởng và cho vào thư mục gốc (không phải src)

## Tải package cần thiết

sau khi clone source về chạy:

- npm i

## Database

- Tạo database tên: webtruyen
- chuyển terminal vào src: cd src
- chạy migration để tạo các bảng: npx sequelize-cli db:migrate
- chạy seeder để tạo dữ liệu giả: npx sequelize-cli db:seed:all

## Cấu trúc thư mục

- src/config: nơi config middleware, database, view engine(nếu có) ...
- src/middleware: hàm trung gian yêu cầu và phản hồi đến (chưa hiểu k sao)
- src/models: ánh xạ bảng CSDL vào đối tượng trong models
- src/controllers: định nghĩa controllers để xử lý tác vụ cho route
- src/routess: viết api điều hướng request đến controllers
- src/migrations: nơi định nghĩa cách tạo bảng
- src/seeder: nơi định nghĩa dữ liệu giả cho bảng, chỉ tạo 1 lần khi xong migrate
- src/services: nơi định nghĩa hàm xử lý cho controllers (ví dụ truy vấn CRUD cho controller)
  luồng:
  routers<->controllers<->services
- app.js: file chạy server

## Lưu ý:

- code có comment rõ ràng
- xem file sau để hiểu hơn
  +models/user.model.js
  +services/user.service.js
  +controller/user.controller.js
  +routes/user.route.js
  +app.js
- File được upload vào thư mục src/uploads sẽ KHÔNG được đẩy lên github

## tham khảo

- Joi: thư viện validate đầu vào (https://joi.dev/api/?v=17.13.3)
- http-errors (https://github.com/jshttp/http-errors)
- module-alias (https://github.com/ilearnio/module-alias)
- sequelize (https://sequelize.org/docs/v6/)
- sequelize-cli
- multer: thư viện upload file
