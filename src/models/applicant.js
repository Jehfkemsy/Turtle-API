import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  school: { type: String, required: true },
  major: { type: String, required: true },
  levelOfStudy: { type: String, required: true },
  resume: { type: String, required: true },
  gender: { type: String, required: true },
  shirtSize: { type: String, required: true },
  diet: { type: String, default: "N/A" },
  mlh: { type: String, default: "AGREE" },
  timestamp: { type: Date, default: new Date() },
  confirmation: { type: Boolean, default: false }
});

const Applicant = mongoose.model("Applicant", applicantSchema);

export default Applicant;
