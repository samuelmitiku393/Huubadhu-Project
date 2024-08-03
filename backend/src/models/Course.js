import { Schema, model } from "mongoose";
const courseSchema = new Schema({
  title: String,
  description: String,
  content: [{ type: Schema.Types.ObjectId, ref: "Content" }],
  instructor: { type: Schema.Types.ObjectId, ref: "User" },
  studentsEnrolled: [{ type: Schema.Types.ObjectId, ref: "User" }],
});

const Course = model("Course", courseSchema);
export default Course;
