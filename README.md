# E-Premium | Standard English Center Backend

Máy chủ API của E-Premium đóng vai trò trung tâm điều phối tất cả các hoạt động nghiệp vụ cho Trung tâm Tiếng Anh Standard. Được xây dựng trên nền tảng **Node.js (Express 5)**, máy chủ cung cấp dịch vụ xác thực, quản lý cơ sở dữ liệu khóa học, và giao tiếp với các dịch vụ bên thứ ba (Storage, Email).

## Các tính năng chính

*   **Xác thực người dùng (Auth)**: Hỗ trợ Đăng nhập/Đăng ký bảo mật với Passport.js và JWT.
*   **Quản lý Phân quyền (RBAC)**: Middleware kiểm soát quyền truy cập cho Admin, Instructor và Student.
*   **Quản lý Khóa học**: API CRUD cho các lớp học, bài giảng và tài liệu học tập.
*   **Lưu trữ Đám mây**: Tích hợp Cloudinary để tải lên và tối ưu hóa hình ảnh khóa học.
*   **Thông báo qua Email**: Gửi thông tin đăng ký, khôi phục mật khẩu thông qua SMTP (Nodemailer).
*   **Dễ bảo trì**: Mã nguồn phân lớp rõ ràng (Routes, Controllers, Middleware, Models).
*   **Tài liệu API (Swagger)**: Tự động tạo tài liệu OpenAPI cho lập trình viên frontend.

## Công nghệ sử dụng

Hệ thống được thiết kế với sự kết hợp linh hoạt giữa các thư viện hàng đầu:

| Phân loại | Công nghệ |
| :--- | :--- |
| **Runtime** | [Node.js](https://nodejs.org/), [Express v5](https://expressjs.com/) |
| **Cơ sở dữ liệu** | [MongoDB](https://www.mongodb.com/) với [Mongoose](https://mongoosejs.com/) |
| **Bảo mật** | [Passport.js](https://www.passportjs.org/), [JWT](https://jwt.io/), [Bcrypt.js](https://github.com/dcodeIO/bcrypt.js) |
| **Xác thực dữ liệu** | [Zod](https://zod.dev/) |
| **Lưu trữ ảnh** | [Cloudinary](https://cloudinary.com/) với [Multer](https://github.com/expressjs/multer) |
| **Gửi Email** | [Nodemailer](https://nodemailer.com/) |
| **Ghi Log** | [Pinto](https://github.com/pinojs/pino) |
| **Tài liệu** | [Swagger UI](https://swagger.io/tools/swagger-ui/) |

## Cấu trúc thư mục

Tổ chức mã nguồn theo hướng chuyên biệt hóa (Layered Architecture):

~~~text [Directory Structure]
src/
├── config/             # Cấu hình dịch vụ (Cloudinary, Passport, Swagger)
├── controllers/        # Xử lý logic nghiệp vụ cho từng endpoint
├── middleware/         # Bộ lọc: Xác thực, Phân quyền, Xử lý lỗi
├── models/             # Định nghĩa Schema dữ liệu (Mongoose)
├── routes/             # Khai báo tuyến đường API (Auth, User, Courses)
├── seeds/              # Dữ liệu mẫu (Tạo tài khoản Admin mặc định)
└── utils/              # Các hàm tiện ích (Gửi mail, định dạng ngày tháng)
├── app.js              # Cấu hình middleware và ứng dụng chính
└── server.js           # Điểm khởi đầu khởi chạy máy chủ
~~~

## Thiết lập và Khởi chạy

Để bắt đầu chạy API trên máy cục bộ của bạn, hãy làm theo các bước dưới đây.

### 1. Cài đặt các gói phụ thuộc

~~~bash [Terminal]
npm install
~~~

### 2. Cấu hình biến môi trường

Tạo một tệp `.env` dựa trên bản mẫu `.env.template` và điền đầy đủ các thông tin:

*   **MONGO\_URI**: Địa chỉ kết nối đến cơ sở dữ liệu MongoDB của bạn.
*   **JWT\_SECRET**: Chuỗi ký tự bảo mật cho JWT.
*   **Cloudinary Config**: Các thông số `CLOUD_NAME`, `API_KEY`, `API_SECRET`.
*   **SMTP Config**: Thông số tài khoản Email người gửi.

### 3. Khởi động máy chủ

**Chế độ phát triển (Sử dụng Nodemon):**

~~~bash [Terminal]
npm run dev
~~~

**Chế độ sản xuất:**

~~~bash [Terminal]
npm start
~~~

Mặc định máy chủ sẽ chạy tại `http://localhost:5000/api`.

### 4. Tài liệu API (Swagger UI)

Sau khi khởi chạy, truy cập địa chỉ sau để xem tài liệu API đầy đủ:
`http://localhost:5000/api-docs`

## Thông tin hỗ trợ

*   **Đội ngũ phát triển**: Dev Team @ E-Premium
*   **Email kỹ thuật**: tech@epremium.edu.vn
