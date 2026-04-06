import express from "express";
import { register, login, getMe, setupAdmin, getUsers } from "../controllers/authController.js";
import passport from "../config/passport.js";

const router = express.Router();

// Middleware kiểm tra quyền Quản trị viên (Admin)
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Lỗi: Yêu cầu quyền Quản trị viên" });
  }
};

/**
 * @swagger
 * tags:
 *   name: Xác thực
 *   description: Quản lý và xác thực người dùng
 */

/**
 * @swagger
 * /api/v1/auth/setup-admin:
 *   post:
 *     summary: Khởi tạo admin đầu tiên (thiết lập một lần)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               name: {type: string, example: "Admin Name"}
 *               email: {type: string, example: "admin@example.com"}
 *               password: {type: string, example: "password123"}
 *     responses:
 *       201:
 *         description: Tài khoản admin được tạo thành công
 *       403:
 *         description: Admin đã được khởi tạo rồi
 */
router.post("/setup-admin", setupAdmin);

/**
 * @swagger
 * /api/v1/auth/register:
 *   post:
 *     summary: Đăng ký người dùng mới
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password, name]
 *             properties:
 *               name: {type: string, example: "User Name"}
 *               email: {type: string, example: "user@example.com"}
 *               password: {type: string, example: "password123"}
 *     responses:
 *       201:
 *         description: Đăng ký thành công
 *       400:
 *         description: Email đã tồn tại
 */
router.post("/register", register);


/**
 * @swagger
 * /api/v1/auth/login:
 *   post:
 *     summary: Đăng nhập người dùng
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: {type: string, example: "user@example.com"}
 *               password: {type: string, example: "password123"}
 *     responses:
 *       200:
 *         description: Đăng nhập thành công, trả về JWT token
 *       401:
 *         description: Email hoặc mật khẩu không chính xác
 *       403:
 *         description: Tài khoản chưa được kích hoạt
 */
router.post("/login", login);

/**
 * @swagger
 * /api/v1/auth/me:
 *   get:
 *     summary: Lấy thông tin hồ sơ người dùng hiện tại
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Dữ liệu người dùng hiện tại
 *       401:
 *         description: Không được xác thực - token không hợp lệ
 */
router.get("/me", passport.authenticate("jwt", { session: false }), getMe);

/**
 * @swagger
 * /api/v1/auth/users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng (Chỉ dành cho Admin)
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema: {type: string, enum: [admin, instructor, student]}
 *         description: Lọc danh sách người dùng theo vai trò
 *     responses:
 *       200:
 *         description: Lấy danh sách người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean, example: true}
 *                 count: {type: integer, example: 15}
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: {type: string, example: "507f1f77bcf86cd799439011"}
 *                       name: {type: string, example: "John Doe"}
 *                       email: {type: string, example: "john@example.com"}
 *                       role: {type: string, enum: [admin, instructor, student], example: "student"}
 *                       is_active: {type: boolean, example: true}
 *                       createdAt: {type: string, format: date-time}
 *       401:
 *         description: Không được xác thực - token không hợp lệ
 *       403:
 *         description: Forbidden - chỉ admin có thể truy cập
 */
router.get("/users", passport.authenticate("jwt", { session: false }), authorizeAdmin, getUsers);

export default router;
