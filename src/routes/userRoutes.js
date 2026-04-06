import express from "express";
import { getUsers, getUser, createUser, updateUser, deleteUser } from "../controllers/userController.js";
import passport from "../config/passport.js";

const router = express.Router();

// Middleware to check for Admin role
const authorizeAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(403).json({ success: false, message: "Forbidden: Admin access required" });
  }
};

// Protect all routes under /api/v1/users (Admin-only)
router.use(passport.authenticate("jwt", { session: false }), authorizeAdmin);

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User Management (Admin only)
 */

/**
 * @swagger
 * /api/v1/users:
 *   get:
 *     summary: Lấy danh sách tất cả người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema: {type: string, enum: [admin, instructor, student]}
 *         description: Lọc người dùng theo vai trò
 *     responses:
 *       200:
 *         description: Lấy danh sách người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean, example: true}
 *                 count: {type: integer, example: 10}
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
 *       403:
 *         description: Forbidden - chỉ admin có thể truy cập
 */
router.get("/", getUsers);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   get:
 *     summary: Lấy thông tin một người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Lấy thông tin người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean, example: true}
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id: {type: string, example: "507f1f77bcf86cd799439011"}
 *                     name: {type: string, example: "John Doe"}
 *                     email: {type: string, example: "john@example.com"}
 *                     role: {type: string, enum: [admin, instructor, student], example: "student"}
 *                     is_active: {type: boolean, example: true}
 *                     createdAt: {type: string, format: date-time}
 *       404:
 *         description: Người dùng không tìm thấy
 *       403:
 *         description: Forbidden - chỉ admin có thể truy cập
 */
router.get("/:id", getUser);

/**
 * @swagger
 * /api/v1/users:
 *   post:
 *     summary: Tạo người dùng mới
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name: {type: string, example: "John Doe"}
 *               email: {type: string, example: "john@example.com"}
 *               password: {type: string, example: "password123"}
 *               role: {type: string, enum: [admin, instructor, student], example: "student", default: "student"}
 *               is_active: {type: boolean, example: true, default: true}
 *     responses:
 *       201:
 *         description: Người dùng được tạo thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean, example: true}
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: {type: string, example: "507f1f77bcf86cd799439011"}
 *                     name: {type: string, example: "John Doe"}
 *                     email: {type: string, example: "john@example.com"}
 *                     role: {type: string, enum: [admin, instructor, student], example: "student"}
 *       400:
 *         description: Email đã tồn tại hoặc lỗi validation
 *       403:
 *         description: Forbidden - chỉ admin có thể truy cập
 */
router.post("/", createUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   put:
 *     summary: Cập nhật thông tin người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         description: ID của người dùng
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name: {type: string, example: "John Doe"}
 *               email: {type: string, example: "john@example.com"}
 *               password: {type: string, example: "newpassword123"}
 *               role: {type: string, enum: [admin, instructor, student], example: "instructor"}
 *               is_active: {type: boolean, example: true}
 *     responses:
 *       200:
 *         description: Cập nhật người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean, example: true}
 *                 data:
 *                   type: object
 *                   properties:
 *                     id: {type: string, example: "507f1f77bcf86cd799439011"}
 *                     name: {type: string, example: "John Doe"}
 *                     email: {type: string, example: "john@example.com"}
 *                     role: {type: string, enum: [admin, instructor, student], example: "instructor"}
 *                     is_active: {type: boolean, example: true}
 *       400:
 *         description: Không thể hạ cấp hoặc xóa admin duy nhất (yêu cầu ít nhất 1 admin)
 *       404:
 *         description: Người dùng không tìm thấy
 *       403:
 *         description: Forbidden - chỉ admin có thể truy cập
 */
router.put("/:id", updateUser);

/**
 * @swagger
 * /api/v1/users/{id}:
 *   delete:
 *     summary: Xóa người dùng
 *     tags: [Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         description: ID của người dùng
 *     responses:
 *       200:
 *         description: Xóa người dùng thành công
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean, example: true}
 *                 message: {type: string, example: "User removed successfully"}
 *       400:
 *         description: Không thể xóa admin duy nhất (yêu cầu ít nhất 1 admin)
 *       404:
 *         description: Người dùng không tìm thấy
 *       403:
 *         description: Forbidden - chỉ admin có thể truy cập
 */
router.delete("/:id", deleteUser);

export default router;
