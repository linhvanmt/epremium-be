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

router.get("/", getUsers);
router.get("/:id", getUser);
router.post("/", createUser);
router.put("/:id", updateUser);
router.delete("/:id", deleteUser);

export default router;
