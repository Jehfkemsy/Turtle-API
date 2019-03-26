import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  levelOfStudy: { type: String, default: "N/A" },
  graduationYear: { type: String, required: true },
  major: { type: String, required: true },
  gender: { type: String, required: true },
  dob: { type: String, required: true },
  race: { type: String, required: true },
  phoneNumber: { type: String, required: true },
  shirtSize: { type: String, required: true },
  avatarID: {type: String, required: true},
  dietaryRestriction: {type: String, required: true},
  firstTimeHackthon: {type: boolean, required: true},
  howDidYouHear: {type: String, required: true},
  favoriteEvents: {type: [String], default: String},
  areaOfFocus: {type: String, required: true},
  resume: {type: String, required: true},
  linkedIn: {type: String, default: "N/A"},
  portfolio: {type: String, default: "N/A"},
  github: {type: String,  default: "N/A"},
  reasonForAttendingShellHacks: {type: String, required: true},
  haveYouBeenToShellHacks: {type: boolean, required: true},
  wouldYouLikeAMentor: {type: boolean, required: true},
  applicationStatus: {type: String, required: true},
  reimburesmentNeeded: {type: boolean, required: true},
  location: {type: String, required: true},
  shellID: {type: String, required: true}
});

const Applicant = mongoose.model("Applicant", applicantSchema);

export default Applicant;
