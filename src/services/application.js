import Applicant from "../models/applicant";
import Volunteer from "../models/volunteer";
import Workshop from "../models/workshop";
import Mentor from "../models/mentor";

const validateWalkin = applicant => {
  new Promise(async (resolve, reject) => {
    const isApplicant = await Applicant.findOne({ email: applicant.email });

    if (isApplicant) reject("Applicant is already signed up.");

    if (!applicant.firstName) reject("First Name was not defined");
    if (!applicant.lastName) reject("Last Name was not defined");
    if (!applicant.email) reject("Email was not defined");
    if (!applicant.school) reject("School was not defined");
    if (!applicant.major) reject("Major was not defined");

    resolve();
  });
};

// const validateHacker = applicant =>
//   new Promise(async (resolve, reject) => {
//     const isApplicant = await Applicant.findOne({ email: applicant.email });

//     if (isApplicant) reject("Applicant is already signed up.");

//     if (!applicant.firstName) reject("First Name was not defined");
//     if (!applicant.lastName) reject("Last Name was not defined");
//     if (!applicant.email) reject("Email was not defined");
//     if (!applicant.school) reject("School was not defined");
//     if (!applicant.major) reject("Major was not defined");
//     if (!applicant.levelOfStudy) reject("Level Of Study was not defined");
//     if (!applicant.gender) reject("Gender was not defined");
//     if (!applicant.shirtSize) reject("Shirt Size was not defined");

//     resolve();
//   });

const validateHacker = async fields =>{
  
    
    const applicantExist = await Applicant.findOne({email : fields.email})

    if(applicantExist) throw("Email already exists")

  
  
}

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

const validateCandidate = applicant =>
  new Promise(async (reject, resolve) => {
    if (!applicant.email) reject("Email was not defined");

    resolve();
  });

  const resetPasswordValidation = async(email, newPassword, token)=>{

    const applicant = await Applicant.findOne({email: email});

    if(!applicant){throw "Email does not exist";}

    if(!applicant.resetPasswordToken){
      throw "User has not requested to change password";
    }

    if(applicant.resetPasswordExpiration < Date.now()){
      throw "Token provided is expired";
    }

    if(!token){
      throw "Reset password token must be provided";
    }

    if(token != applicant.resetPasswordToken.trim()){
      console.log("token " + token + " provided token: " +  applicant.resetPasswordToken);
      throw "Token is invalid";
    }

      if(!newPassword){
        throw "new password must be provided";
      }
  }

  const applicationStatistics = async () => {
    const numApplicants = await Applicant.countDocuments({});
    const numConfirmed = await Applicant.countDocuments({applicationStatus: 'confirmed'});
    const numApplied = await Applicant.countDocuments({applicationStatus: 'applied'});
    const numNotApplied = await Applicant.countDocuments({applicationStatus:'not applied'});
    const numAccepted = await Applicant.countDocuments({applicationStatus: 'accepted'});
    const numMales = await Applicant.countDocuments({gender: 'male'});
    const numFemales = await Applicant.countDocuments({gender: 'female'});

    return {
      numApplicants,
      numConfirmed,
      numApplied,
      numNotApplied,
      numFemales,
      numMales,
      numAccepted
    }

  }

export default {
  validateHacker,
  validateWalkin,
  validateWorkshop,
  validateMentor,
  validateVolunteer,
  validateCandidate,
  resetPasswordValidation,
  applicationStatistics
};
