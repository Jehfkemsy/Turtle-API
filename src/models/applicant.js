import mongoose from "mongoose";

const applicantSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: {type: String, required: true},
  password: {type:String, required: true},
  resetPasswordToken: {type: String},
  resetPasswordExpiration: {type: Date},
  schoolName: {type:String},
  levelOfStudy: { type: String, default: "N/A" },
  graduationYear: { type: String },
  major: { type: String},
  gender: { type: String },
  dob: { type: String },
  race: { type: String },
  phoneNumber: { type: String },
  shirtSize: { type: String },
  avatarID: {type: String},
  dietaryRestriction: {type: String},
  firstTimeHack: {type: Boolean},
  howDidYouHear: {type: String},
  favoriteEvents: {type: [String], default: String},
  areaOfFocus: {type: String},
  resume: {type: String},
  linkedIn: {type: String, default: "N/A"},
  portfolio: {type: String, default: "N/A"},
  github: {type: String,  default: "N/A"},
  reasonForAttending: {type: String},
  haveBeenToShell: {type: Boolean},
  likeAMentor: {type: Boolean},
  applicationStatus: {type: String},
  needReimburesment: {type: Boolean},
  location: {type: String},
  shellID: {type: String},
  mlh: { type: String, default: "AGREE" },
  fiu: { type: String, default: "AGREE" },
  shellHacks: { type: String, default: "AGREE" },
});

const Applicant = mongoose.model("Applicant", applicantSchema);

export default Applicant;
