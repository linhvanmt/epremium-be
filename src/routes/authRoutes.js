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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean, example: true}
 *                 message: {type: string}
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: {type: string}
 *                     name: {type: string}
 *                     email: {type: string}
 *                     role: {type: string, enum: [admin]}
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean, example: true}
 *                 message: {type: string}
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: {type: string}
 *                     name: {type: string}
 *                     email: {type: string}
 *                     role: {type: string, enum: [student, instructor]}
 *       400:
 *         description: Người dùng đã tồn tại
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean, example: true}
 *                 message: {type: string}
 *                 token: {type: string, format: jwt}
 *       401:
 *         description: Email hoặc mật khẩu không chính xác
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
 *         description: Thông tin người dùng hiện tại
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean, example: true}
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: {type: string}
 *                     name: {type: string}
 *                     email: {type: string}
 *                     role: {type: string}
 *       401:
 *         description: Không được phép - token không hợp lệ
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
 *         schema:
 *           type: string
 *           enum: [admin, instructor, student]
 *         description: Lọc theo role của người dùng
 *     responses:
 *       200:
 *         description: Danh sách người dùng
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean, example: true}
 *                 count: {type: integer}
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id: {type: string}
 *                       name: {type: string}
 *                       email: {type: string}
 *                       role: {type: string}
 *       403:
 *         description: Forbidden - chỉ admin có thể truy cập
 */
router.get("/users", passport.authenticate("jwt", { session: false }), authorizeAdmin, getUsers);

export default router;
