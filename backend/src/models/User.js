import { Schema, model } from "mongoose";

const userSchema = new Schema({
  username: String,
  email: String,
  password: String,
  role: {
    type: String,
    enum: ["student", "teacher", "admin"],
    default: "student",
  },
  profileInfo: Object,
});

const User = model("User", userSchema);
export default User;
