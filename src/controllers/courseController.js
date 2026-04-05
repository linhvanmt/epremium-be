import Course from "../models/Course.js";
import asyncHandler from "express-async-handler";
import cloudinary from "../config/cloudinary.js";

/**
 * @desc    Get courses for landing page
 * @route   GET /api/v1/courses/landing
 * @access  Public
 */
export const getLandingCourses = asyncHandler(async (req, res) => {
  // Only return essential fields for landing page to optimize response
  const courses = await Course.find()
    .select("title level description full_description total_duration total_lessons total_students price image schedule rating instructor_id")
    .populate("instructor_id", "name email")
    .limit(6);
    
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

/**
 * @desc    Get all courses
 * @route   GET /api/v1/courses
 * @access  Public
 */
export const getCourses = asyncHandler(async (req, res) => {
  const courses = await Course.find().populate("instructor_id", "name email");
  res.status(200).json({
    success: true,
    count: courses.length,
    data: courses,
  });
});

/**
 * @desc    Get single course
 * @route   GET /api/v1/courses/:id
 * @access  Public
 */
export const getCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id).populate("instructor_id", "name email");
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }
  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @desc    Create new course
 * @route   POST /api/v1/courses
 * @access  Private/Admin
 */
export const createCourse = asyncHandler(async (req, res) => {
  const { title, level, description, full_description, total_duration, total_lessons, total_students, rating, price, curriculum, schedule } = req.body;

  let image;
  if (req.file) {
    image = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  const course = await Course.create({
    title,
    level,
    description,
    full_description,
    total_duration: total_duration || "8 Weeks",
    total_lessons,
    total_students,
    rating,
    price,
    image,
    curriculum: typeof curriculum === "string" ? JSON.parse(curriculum) : curriculum,
    instructor_id: req.user.id,
    schedule,
  });

  res.status(201).json({
    success: true,
    data: course,
  });
});

/**
 * @desc    Update course
 * @route   PUT /api/v1/courses/:id
 * @access  Private/Admin
 */
export const updateCourse = asyncHandler(async (req, res) => {
  let course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Handle image update if file provided
  if (req.file) {
    // Delete old image from cloudinary
    if (course.image && course.image.public_id) {
      await cloudinary.uploader.destroy(course.image.public_id);
    }
    req.body.image = {
      url: req.file.path,
      public_id: req.file.filename,
    };
  }

  // Handle curriculum if it's a string from form-data
  if (req.body.curriculum && typeof req.body.curriculum === "string") {
    req.body.curriculum = JSON.parse(req.body.curriculum);
  }

  course = await Course.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    success: true,
    data: course,
  });
});

/**
 * @desc    Delete course
 * @route   DELETE /api/v1/courses/:id
 * @access  Private/Admin
 */
export const deleteCourse = asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  if (!course) {
    res.status(404);
    throw new Error("Course not found");
  }

  // Delete image from cloudinary
  if (course.image && course.image.public_id) {
    await cloudinary.uploader.destroy(course.image.public_id);
  }

  await course.deleteOne();

  res.status(200).json({
    success: true,
    message: "Course removed",
  });
});
