import dotenv from "dotenv";
dotenv.config({ path: [".env.local", ".env"] });

import express from "express";
import helmet from "helmet";
import cors from "cors";
import compression from "compression";
import mongoose from "mongoose";
import { errorHandler } from "./middleware/errorHandler.js";
import { setupSwagger } from "./config/swagger.js";
import authRoutes from "./routes/authRoutes.js";
import courseRoutes from "./routes/courseRoutes.js";
import userRoutes from "./routes/userRoutes.js";

const MONGO_URI = process.env.MONGO_URI || "mongodb://localhost:27017/epremium";

const connectDB = async () => {
  if (mongoose.connection.readyState >= 1) return;
  try {
    await mongoose.connect(MONGO_URI);
    console.log(`MongoDB Connected`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
  }
};

connectDB();

const app = express();

// Security & Compression
app.use(helmet());
app.use(cors({ origin: "*" }));
app.use(compression());

// Body parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Basic logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`);
  next();
});

// Health check
app.get("/health", (req, res) => {
  res.status(200).json({ status: "ok", timestamp: new Date().toISOString() });
});

// Swagger Documentation
try {
  setupSwagger(app);
} catch (error) {
  console.error("Swagger setup error:", error.message);
  app.get("/api/v1/docs", (req, res) => {
    res.status(200).json({ message: "Documentation", status: "unavailable" });
  });
}

// API Routes
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/courses", courseRoutes);
app.use("/api/v1/users", userRoutes);

// Error handling
app.use(errorHandler);

export default app;
