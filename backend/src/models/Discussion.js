import { Schema, model } from "mongoose";

const discussionSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  user: { type: Schema.Types.ObjectId, ref: "User" },
  comment: String,
  timestamp: Date,
});

const Discussion = model("Discussion", discussionSchema);
export default Discussion;
