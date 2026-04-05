export const authorize = (...roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "Chưa được xác thực" });
    }

    if (!roles.includes(req.user.role)) {
      return res.status(403).json({
        success: false,
        message: `Tài khoản với vai trò '${req.user.role}' không có quyền truy cập chức năng này`,
      });
    }

    next();
  };
};
