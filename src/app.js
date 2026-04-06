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
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Don't throw - allow the app to start even if DB fails
    // Routes will handle DB errors gracefully
  }
};

const app = express();

// Connect to DB (non-blocking)
connectDB().catch(err => console.error("DB Connection error:", err));

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

// Cấu hình Swagger Documentation (Public access - no token required)
try {
  setupSwagger(app);
} catch (error) {
  console.error("Failed to setup Swagger:", error.message);
  // Fallback route if Swagger setup fails
  app.get("/api/v1/docs", (req, res) => {
    res.status(200).json({ message: "API Documentation - Swagger temporarily unavailable", status: "setup_error" });
  });
}

// Cấu hình các tuyến đường (Routes)
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/users", userRoutes);

// Xử lý lỗi tập trung (Error handling)
app.use(errorHandler);

export default app;
