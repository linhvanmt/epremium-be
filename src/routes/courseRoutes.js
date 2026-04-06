import express from "express";
import { getLandingCourses, getCourses, getCourse, createCourse, updateCourse, deleteCourse } from "../controllers/courseController.js";
import passport from "../config/passport.js";
import { authorize } from "../middleware/roleMiddleware.js";
import { upload } from "../config/cloudinary.js";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Courses
 *   description: Course management and public listing
 */

/**
 * @swagger
 * /api/v1/courses/landing:
 *   get:
 *     summary: Lấy các khóa học công khai cho trang landing
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Danh sách các khóa học (tối đa 6)
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
 *                       title: {type: string}
 *                       description: {type: string}
 *                       level: {type: string}
 *                       price: {type: number}
 *                       rating: {type: number}
 *                       total_students: {type: integer}
 *                       image: {type: object}
 *                       instructor_id: {type: object}
 */
router.get("/landing", getLandingCourses);

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Lấy tất cả các khóa học
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: Danh sách tất cả khóa học
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
 *                       title: {type: string}
 *                       level: {type: string}
 *                       price: {type: number}
 *                       total_duration: {type: string}
 *                       total_lessons: {type: integer}
 *                       rating: {type: number}
 */
router.get("/", getCourses);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     summary: Lấy chi tiết một khóa học
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *         description: ID của khóa học
 *     responses:
 *       200:
 *         description: Thông tin chi tiết khóa học
 *       404:
 *         description: Khóa học không tỉm thấy
 */
router.get("/:id", getCourse);

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: Tạo một khóa học mới
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, level, price]
 *             properties:
 *               title: {type: string, example: "English for Beginners"}
 *               description: {type: string}
 *               full_description: {type: string}
 *               level: {type: string, enum: [beginner, intermediate, advanced]}
 *               price: {type: number, example: 99.99}
 *               total_duration: {type: string}
 *               total_lessons: {type: integer}
 *               total_students: {type: integer}
 *               rating: {type: number}
 *               image: {type: string, format: binary}
 *     responses:
 *       201:
 *         description: Khóa học được tạo thành công
 *       401:
 *         description: Không được phép
 *       403:
 *         description: Chỉ admin và instructor có thể tạo khóa học
 */
router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  authorize("admin", "instructor"),
  upload.single("image"),
  createCourse
);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   put:
 *     summary: Cập nhật một khóa học
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               title: {type: string}
 *               description: {type: string}
 *               price: {type: number}
 *               image: {type: string, format: binary}
 *     responses:
 *       200:
 *         description: Khóa học được cập nhật thành công
 *       404:
 *         description: Khóa học không tểm thấy
 */
router.put(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  authorize("admin", "instructor"),
  upload.single("image"),
  updateCourse
);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   delete:
 *     summary: Xóa một khóa học
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *     responses:
 *       200:
 *         description: Khóa học được xóa thành công
 *       404:
 *         description: Khóa học không tểm thấy
 *       403:
 *         description: Chỉ Admin có thể xóa khóa học
 */
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  authorize("admin"),
  deleteCourse
);

export default router;
