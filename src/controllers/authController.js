import passport from "passport";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import asyncHandler from "express-async-handler";

/**
 * @desc    Khởi tạo quản trị viên đầu tiên (Thiết lập một lần)
 * @route   POST /api/auth/setup-admin
 * @access  Công khai (Chỉ giới hạn cho lần đầu)
 */
export const setupAdmin = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Kiểm tra xem đã có tài khoản admin nào tồn tại chưa
  const adminExists = await User.findOne({ role: "admin" });
  if (adminExists) {
    res.status(403);
    throw new Error("Cài đặt ban đầu đã hoàn tất. Vui lòng sử dụng đăng ký thông thường.");
  }

  // Tạo tài khoản admin đầu tiên
  const user = await User.create({
    email,
    password,
    name,
    role: "admin",
    is_active: true, // Tự động kích hoạt cho admin gốc
  });

  res.status(201).json({
    success: true,
    message: "Tài khoản Quản trị viên gốc đã được tạo thành công.",
    data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role
    }
  });
});

/**
 * @desc    Đăng ký người dùng mới
 * @route   POST /api/auth/register
 * @access  Công khai
 */
export const register = asyncHandler(async (req, res) => {
  const { email, password, name } = req.body;

  // Kiểm tra người dùng đã tồn tại chưa
  const userExists = await User.findOne({ email });
  if (userExists) {
    res.status(400);
    throw new Error("Người dùng đã tồn tại");
  }

  // Tạo người dùng mới (kích hoạt ngay)
  const user = await User.create({
    email,
    password,
    name,
    is_active: true,
  });

  res.status(201).json({
    success: true,
    message: "Đăng ký thành công. Bạn có thể đăng nhập ngay.",
    data: {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    },
  });
});



/**
 * @desc    Đăng nhập người dùng
 * @route   POST /api/auth/login
 * @access  Công khai
 */
export const login = (req, res, next) => {
  passport.authenticate("local", { session: false }, (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ success: false, message: info?.message || "Đăng nhập thất bại" });
    }
    if (!user.is_active) {
      return res.status(403).json({ success: false, message: "Tài khoản chưa được kích hoạt" });
    }

    // Tạo mã JWT
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET || "supersecret", {
      expiresIn: "1d",
    });

    res.status(200).json({
      success: true,
      data: {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    });
  })(req, res, next);
};

/**
 * @desc    Lấy thông tin hồ sơ người dùng hiện tại
 * @route   GET /api/auth/me
 * @access  Riêng tư
 */
export const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user?._id).select("-password");
  res.status(200).json({
    success: true,
    data: user,
  });
});

/**
 * @desc    Lấy danh sách tất cả người dùng (Chỉ dành cho Admin)
 * @route   GET /api/auth/users
 * @access  Riêng tư/Admin
 */
export const getUsers = asyncHandler(async (req, res) => {
  const { role } = req.query;
  const query = role ? { role } : {};
  
  const users = await User.find(query).select("-password");
  res.status(200).json({
    success: true,
    count: users.length,
    data: users,
  });
});
