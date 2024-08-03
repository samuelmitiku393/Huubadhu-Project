import { Schema, model } from "mongoose";

const contentSchema = new Schema({
  course: { type: Schema.Types.ObjectId, ref: "Course" },
  type: { type: String, enum: ["video", "pdf", "text"] },
  contentURL: String,
  description: String,
});

const Content = model("Content", contentSchema);
export default Content;
