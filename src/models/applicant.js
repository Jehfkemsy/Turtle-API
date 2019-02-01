import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  school: { type: String, required: true },
  major: { type: String, required: true },
  levelOfStudy: { type: String, default: "N/A" },
  resume: { type: String, default: "N/A" },
  gender: { type: String, default: "N/A" },
  shirtSize: { type: String, default: "N/A" },
  diet: { type: String, default: "N/A" },
  mlh: { type: String, default: "AGREE" },
  timestamp: { type: Date, default: new Date() },
  confirmation: { type: Boolean, default: false },
  isWalkIn: { type: Boolean, default: false },
  checkIn: { type: Boolean, default: false }
});

const Applicant = mongoose.model("Applicant", applicantSchema);

export default Applicant;
