import Applicant from "../models/applicant";

const validateApplicant = applicant =>
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

export default { validateApplicant };
