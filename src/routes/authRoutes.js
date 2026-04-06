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
 *               name: {type: string}
 *               email: {type: string}
 *               password: {type: string}
 *     responses:
 *       201: {description: Created}
 *       403: {description: Forbidden if already setup}
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
 *               name: {type: string}
 *               email: {type: string}
 *               password: {type: string}
 *     responses:
 *       201: {description: Đăng ký thành công, đăng nhập ngay được}
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
 *               email: {type: string}
 *               password: {type: string}
 *     responses:
 *       200: {description: Đăng nhập thành công, trả về JWT}
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
 *       200: {description: Dữ liệu người dùng}
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
 *     responses:
 *       200: {description: Danh sách người dùng}
 */
router.get("/users", passport.authenticate("jwt", { session: false }), authorizeAdmin, getUsers);

export default router;
