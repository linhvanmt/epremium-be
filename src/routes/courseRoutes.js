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
 *       200: {description: List of public courses}
 */
router.get("/landing", getLandingCourses);

/**
 * @swagger
 * /api/v1/courses:
 *   get:
 *     summary: Get all courses (requires auth for full data)
 *     tags: [Courses]
 *     responses:
 *       200: {description: List of courses}
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
 *       200: {description: Course detail}
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
 *             properties:
 *               title: {type: string}
 *               description: {type: string}
 *               level: {type: string}
 *               tuition: {type: number}
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
