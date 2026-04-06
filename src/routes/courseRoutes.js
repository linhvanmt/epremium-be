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
 *     summary: Get public courses for landing page
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of public courses (limited to 6)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean}
 *                 count: {type: integer}
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: {type: string}
 *                       title: {type: string}
 *                       description: {type: string}
 *                       level: {type: string}
 *                       price: {type: number}
 *                       rating: {type: number}
 *                       total_students: {type: integer}
 *                       total_duration: {type: string}
 *                       instructor_id: {type: object}
 */
router.get("/landing", getLandingCourses);

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Get all courses
 *     tags: [Courses]
 *     responses:
 *       200:
 *         description: List of all courses
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean}
 *                 count: {type: integer}
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       _id: {type: string}
 *                       title: {type: string}
 *                       description: {type: string}
 *                       level: {type: string}
 *                       price: {type: number}
 *                       instructor_id: {type: object}
 */
router.get("/", getCourses);

/**
 * @swagger
 * /api/v1/courses/{id}:
 *   get:
 *     summary: Get single course details
 *     tags: [Courses]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *     responses:
 *       200:
 *         description: Course detail
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: {type: boolean}
 *                 data:
 *                   type: object
 *                   properties:
 *                     _id: {type: string}
 *                     title: {type: string}
 *                     description: {type: string}
 *                     full_description: {type: string}
 *                     level: {type: string}
 *                     price: {type: number}
 *                     total_duration: {type: string}
 *                     total_lessons: {type: integer}
 *                     total_students: {type: integer}
 *                     rating: {type: number}
 *                     image: {type: object}
 *                     instructor_id: {type: object}
 *       404: {description: Course not found}
 */
router.get("/:id", getCourse);

/**
 * @swagger
 * /api/v1/courses:
 *   post:
 *     summary: Create a new course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [title, level, price]
 *             properties:
 *               title: {type: string, example: "English for Beginners"}
 *               description: {type: string, example: "Short description"}
 *               full_description: {type: string}
 *               level: {type: string, enum: [beginner, intermediate, advanced]}
 *               price: {type: number, example: 99.99}
 *               total_duration: {type: string, example: "8 Weeks"}
 *               total_lessons: {type: integer, example: 24}
 *               total_students: {type: integer, example: 0}
 *               rating: {type: number, example: 5}
 *               curriculum: {type: string, example: '["Lesson 1", "Lesson 2"]'}
 *               schedule: {type: string, example: "Monday, Wednesday, Friday"}
 *               image: {type: string, format: binary}
 *     responses:
 *       201: {description: Course created}
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
 *     summary: Update an existing course
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
 *               full_description: {type: string}
 *               level: {type: string, enum: [beginner, intermediate, advanced]}
 *               price: {type: number}
 *               total_duration: {type: string}
 *               total_lessons: {type: integer}
 *               total_students: {type: integer}
 *               rating: {type: number}
 *               curriculum: {type: string}
 *               schedule: {type: string}
 *               image: {type: string, format: binary}
 *     responses:
 *       200: {description: Course updated}
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
 *     summary: Delete a course
 *     tags: [Courses]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: {type: string}
 *     responses:
 *       200: {description: Course deleted}
 */
router.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  authorize("admin"),
  deleteCourse
);

export default router;
