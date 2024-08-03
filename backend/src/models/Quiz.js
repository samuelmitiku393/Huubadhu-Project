import { Schema, model } from "mongoose";

const quizSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  questions: Array,
  answers: Array,
  results: Array,
});
const Quiz = model("Quiz", quizSchema);
export default Quiz;
