import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, unique: true, required: true },
  school: { type: String, required: true },
  major: { type: String, required: true },
  levelOfStudy: { type: String, required: true },
  resume: { type: String, default: "N/A" },
  gender: { type: String, required: true },
  shirtSize: { type: String, required: true },
  diet: { type: String, default: "N/A" },
  mlh: { type: String, default: "AGREE" }
});

const Applicant = mongoose.model("Applicant", applicantSchema);

export default Applicant;
