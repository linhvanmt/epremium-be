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
 *     summary: L\u1ea5y danh s\u00e1ch t\u1ea5t c\u1ea3 ng\u01b0\u1eddi d\u00f9ng\n *     tags: [Users]\n *     security:\n *       - bearerAuth: []\n *     parameters:\n *       - in: query\n *         name: role\n *         schema:\n *           type: string\n *           enum: [admin, instructor, student]\n *         description: L\u1ecdc theo vai tr\u00f2\n *     responses:\n *       200:\n *         description: Danh s\u00e1ch ng\u01b0\u1eddi d\u00f9ng\n *         content:\n *           application/json:\n *             schema:\n *               type: object\n *               properties:\n *                 success: {type: boolean}\n *                 count: {type: integer}\n *                 data:\n *                   type: array\n *                   items:\n *                     type: object\n *                     properties:\n *                       id: {type: string}\n *                       name: {type: string}\n *                       email: {type: string}\n *                       role: {type: string}\n *                       is_active: {type: boolean}\n *       403:\n *         description: Ch\u1ec9 admin c\u00f3 th\u1ec3 truy c\u1eadp\n */\nrouter.get(\"/\", getUsers);\n\n/**\n * @swagger\n * /api/v1/users/{id}:\n *   get:\n *     summary: L\u1ea5y th\u00f4ng tin m\u1ed9t ng\u01b0\u1eddi d\u00f9ng\n *     tags: [Users]\n *     security:\n *       - bearerAuth: []\n *     parameters:\n *       - in: path\n *         name: id\n *         required: true\n *         schema: {type: string}\n *         description: ID c\u1ee7a ng\u01b0\u1eddi d\u00f9ng\n *     responses:\n *       200:\n *         description: Th\u00f4ng tin ng\u01b0\u1eddi d\u00f9ng\n *       404:\n *         description: Ng\u01b0\u1eddi d\u00f9ng kh\u00f4ng t\u1ec3m th\u1ea5y\n *       403:\n *         description: Ch\u1ec9 admin c\u00f3 th\u1ec3 truy c\u1eadp\n */\nrouter.get(\"/:id\", getUser);\n\n/**\n * @swagger\n * /api/v1/users:\n *   post:\n *     summary: T\u1ea1o ng\u01b0\u1eddi d\u00f9ng m\u1edbi\n *     tags: [Users]\n *     security:\n *       - bearerAuth: []\n *     requestBody:\n *       required: true\n *       content:\n *         application/json:\n *           schema:\n *             type: object\n *             required: [name, email, password, role]\n *             properties:\n *               name: {type: string, example: \"John Doe\"}\n *               email: {type: string, example: \"john@example.com\"}\n *               password: {type: string, example: \"password123\"}\n *               role: {type: string, enum: [admin, instructor, student]}\n *               is_active: {type: boolean, default: true}\n *     responses:\n *       201:\n *         description: Ng\u01b0\u1eddi d\u00f9ng \u0111\u01b0\u1ee3c t\u1ea1o th\u00e0nh c\u00f4ng\n *       400:\n *         description: Ng\u01b0\u1eddi d\u00f9ng \u0111\u00e3 t\u1ed3n t\u1ea1i\n *       403:\n *         description: Ch\u1ec9 admin c\u00f3 th\u1ec3 t\u1ea1o ng\u01b0\u1eddi d\u00f9ng\n */\nrouter.post(\"/\", createUser);\n\n/**\n * @swagger\n * /api/v1/users/{id}:\n *   put:\n *     summary: C\u1eadp nh\u1eadt th\u00f4ng tin ng\u01b0\u1eddi d\u00f9ng\n *     tags: [Users]\n *     security:\n *       - bearerAuth: []\n *     parameters:\n *       - in: path\n *         name: id\n *         required: true\n *         schema: {type: string}\n *     requestBody:\n *       content:\n *         application/json:\n *           schema:\n *             type: object\n *             properties:\n *               name: {type: string}\n *               email: {type: string}\n *               role: {type: string}\n *               is_active: {type: boolean}\n *     responses:\n *       200:\n *         description: Ng\u01b0\u1eddi d\u00f9ng \u0111\u01b0\u1ee3c c\u1eadp nh\u1eadt\n *       404:\n *         description: Ng\u01b0\u1eddi d\u00f9ng kh\u00f4ng t\u1ec3m th\u1ea5y\n *       403:\n *         description: Ch\u1ec9 admin c\u00f3 th\u1ec3 c\u1eadp nh\u1eadt\n */\nrouter.put(\"/:id\", updateUser);\n\n/**\n * @swagger\n * /api/v1/users/{id}:\n *   delete:\n *     summary: X\u00f3a ng\u01b0\u1eddi d\u00f9ng\n *     tags: [Users]\n *     security:\n *       - bearerAuth: []\n *     parameters:\n *       - in: path\n *         name: id\n *         required: true\n *         schema: {type: string}\n *     responses:\n *       200:\n *         description: Ng\u01b0\u1eddi d\u00f9ng \u0111\u01b0\u1ee3c x\u00f3a th\u00e0nh c\u00f4ng\n *       404:\n *         description: Ng\u01b0\u1eddi d\u00f9ng kh\u00f4ng t\u1ec3m th\u1ea5y\n *       403:\n *         description: Ch\u1ec9 admin c\u00f3 th\u1ec3 x\u00f3a ng\u01b0\u1eddi d\u00f9ng\n */\nrouter.delete(\"/:id\", deleteUser);

export default router;
