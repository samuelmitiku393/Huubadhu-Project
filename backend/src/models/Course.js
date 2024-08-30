import { Schema, model } from "mongoose";
const courseSchema = new Schema({
  title: String,
  description: String,
  content: [{ type: Schema.Types.ObjectId, ref: "Content" }],
  instructor: { type: Schema.Types.ObjectId, ref: "User" },
  studentsEnrolled: [{ type: Schema.Types.ObjectId, ref: "User" }],
  reviews: [{ type: Schema.Types.ObjectId, ref: "Review" }],
});

const Course = model("Course", courseSchema);
export default Course;
