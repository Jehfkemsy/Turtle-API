import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  email: { type: String, unique: true, required: true },
  role: { type: String, default: "hacker" },
  password: { type: String, required: true }
});

const User = mongoose.model("User", userSchema);

export default User;
