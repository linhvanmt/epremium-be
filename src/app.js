import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import passport from "passport";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import pino from "pino-http";
import { setupSwagger } from "./config/swagger.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/epremium";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    const conn = await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error: ${error.message}`);
  }
};

const app = express();

// Connect to DB
connectDB();

// Các middleware về bảo mật
app.use(helmet());
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",").map(o => o.trim()) || ["*"];
console.log("Allowed Origins:", allowedOrigins);

app.use(cors({
  origin: (origin, callback) => {
    // Cho phép các yêu cầu không có origin (ví dụ: từ mobile app hoặc curl)
    if (!origin) return callback(null, true);

    if (allowedOrigins.indexOf(origin) !== -1 || allowedOrigins.includes("*")) {
      callback(null, true);
    } else {
      console.error(`CORS Error: Origin ${origin} not in whitelist:`, allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(compression());

// Ghi log lỗi cho mỗi yêu cầu (Request logging)
app.use(pino({
  transport: {
    target: "pino-pretty",
    options: { colorize: true }
  }
}));

// Xử lý dữ liệu đầu vào (Body parsing)
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Khởi tạo Passport để xác thực
app.use(passport.initialize());

// Kiểm tra trạng thái hệ thống (Health check)
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date() });
});

// Cấu hình các tuyến đường (Routes)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/users", userRoutes);

// Xử lý lỗi tập trung (Error handling)
app.use(errorHandler);

export default app;
