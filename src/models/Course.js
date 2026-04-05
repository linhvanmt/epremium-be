import mongoose from "mongoose";

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    level: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced", "Junior"],
      required: true,
    },
    description: { type: String, required: true },
    full_description: { type: String },
    total_duration: { type: String, required: true, default: "8 Weeks" },
    total_lessons: { type: Number, default: 24 },
    total_students: { type: Number, default: 0 },
    rating: { type: Number, default: 4.8 },
    price: { type: Number, required: true },
    image: {
      url: { type: String },
      public_id: { type: String },
    },
    curriculum: [{ type: String }],
    instructor_id: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    schedule: { type: String },
  },
  { timestamps: true }
);

export default mongoose.model("Course", CourseSchema);
