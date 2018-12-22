import Applicant from "../models/applicant";
import Volunteer from "../models/volunteer";
import Workshop from "../models/workshop";
import Mentor from "../models/mentor";

const validateHacker = applicant =>
  new Promise(async (resolve, reject) => {
    const isApplicant = await Applicant.findOne({ email: applicant.email });

    if (isApplicant) reject("Applicant is already signed up.");

    if (!applicant.firstName) reject("First Name was not defined");
    if (!applicant.lastName) reject("Last Name was not defined");
    if (!applicant.email) reject("Email was not defined");
    if (!applicant.school) reject("School was not defined");
    if (!applicant.major) reject("Major was not defined");
    if (!applicant.levelOfStudy) reject("Level Of Study was not defined");
    if (!applicant.gender) reject("Gender was not defined");
    if (!applicant.shirtSize) reject("Shirt Size was not defined");

    resolve();
  });

const validateWorkshop = applicant =>
  new Promise(async (resolve, reject) => {
    const isApplicant = await Workshop.findOne({ email: applicant.email });

    if (isApplicant) reject("Applicant is already signed up.");

    if (!applicant.firstName) reject("First Name was not defined");
    if (!applicant.lastName) reject("Last Name was not defined");
    if (!applicant.email) reject("Email was not defined");
    if (!applicant.title) reject("Workshop Title was not defined");
    if (!applicant.description) reject("Workshop Description was not defined");

    resolve();
  });

const validateMentor = applicant =>
  new Promise(async (resolve, reject) => {
    const isApplicant = await Mentor.findOne({ email: applicant.email });

    if (isApplicant) reject("Applicant is already signed up.");

    if (!applicant.firstName) reject("First Name was not defined");
    if (!applicant.lastName) reject("Last Name was not defined");
    if (!applicant.email) reject("Email was not defined");
    if (!applicant.skills) reject("No skills were defined");

    resolve();
  });

const validateVolunteer = applicant =>
  new Promise(async (resolve, reject) => {
    const isApplicant = await Volunteer.findOne({ email: applicant.email });

    if (isApplicant) reject("Applicant is already signed up.");

    if (!applicant.firstName) reject("First Name was not defined");
    if (!applicant.lastName) reject("Last Name was not defined");
    if (!applicant.email) reject("Email was not defined");

    resolve();
  });

export default {
  validateHacker,
  validateWorkshop,
  validateMentor,
  validateVolunteer
};
