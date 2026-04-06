import mongoose from "mongoose";
import dotenv from "dotenv";
import app from "./app.js";

dotenv.config({ path: [".env.local", ".env"] });

const PORT = process.env.PORT || 5000;

// Khởi chạy Máy chủ (Server)
const startServer = async () => {
  app.listen(PORT, () => {
    console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
};

if (process.env.NODE_ENV !== 'production') {
  startServer();
}
