import mailService from "../services/mail";
import fileService from "../services/file";
import drive from "../services/google/drive";
import sheets from "../services/google/sheets";
import createID from '../utils/idGenerator'
import applicationService from "../services/application";
import bcrypt from 'bcrypt-nodejs'
import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";
import Applicant from "../models/applicant";
import jwt from 'jsonwebtoken';

const { GOOGLE_FOLDER_ID, GOOGLE_SPREADSHEET_ID } = process.env;

const create = async (req, res) => {
  const{firstName,lastName,email} = req.body;
  try {

    /*
      validate email is unique
    */
    await applicationService.validateHacker(req.body.email)
    console.log('unique email')

    /*
      hash password
    */
    const password = bcrypt.hashSync(req.body.password)
    console.log('hashed password')
    /*
      generate unique shell id
    */
    
    let id = createID(5);
    console.log(id);
      
      const unique = await Applicant.findOne({shellID: id})
      console.log(unique);

    console.log('id is unique')

    const shellID = id
          
    const fields = {
      firstName,
      lastName,
      email,
      password,
      shellID,
      avatarID:"Id1",
      applicationStatus: 'not applied',
      shellID: 'wewe',
      schoolName: null,
      levelOfStudy: null,
      graduationYear: null,
      major: null,
      gender: null,
      dob: null,
      race: null,
      phoneNumber: null,
      shirtSize: null,
      dietaryRestriction: null,
      firstTimeHack: null,
      howDidYouHear: null,
      favoriteEvents: null,
      areaOfFocus: null,
      resume: null,
      linkedIn: null,
      portfolio: null,
      github: null,
      reasonForAttending: null,
      haveBeenToShell: null,
      likeAMentor: null,
      needReimburesment: null,
      location: null,
      shirtSize: null,
    };

    

      /**
       * Validate applicant fields
       */
      // await applicationService.validateHacker(fields);


      /**
       * Insert applicant in the database
       */
      const applicant = await Applicant.create(fields);

      /**
       * Send applicant email
       */
      // mailService.applied(fields);

      /**
       * Insert applicant in google sheets
       */
      // sheets.write("Applicants", fields);

      httpResponse.successResponse(res, applicant);
    } catch (e) {
      console.log(e);
      logger.info({ e, application: "Hacker", email: fields.email });
      httpResponse.failureResponse(res, e);
    }
  
};

const read = async (req, res) => {
  const { page = 0, limit = 30, q } = req.query;

  const queryLimit = parseInt(Math.abs(limit));
  const pageQuery = parseInt(Math.abs(page)) * queryLimit;

  const currentPage = pageQuery / queryLimit;

  let searchCriteria = {};
  try {
    if (q && q.length > 0 && q !== "") {
      searchCriteria = {
        $or: [
          { firstName: new RegExp(".*" + q + ".*", "i") },
          { lastName: new RegExp(".*" + q + ".*", "i") },
          { email: new RegExp(".*" + q + ".*", "i") }
        ]
      };
    }

    const applicants = await Applicant.find(searchCriteria, {
      _id: 0,
      __v: 0
    })
      .skip(pageQuery)
      .limit(queryLimit)
      .sort({ timestamp: -1 });

    if (!applicants || applicants.length <= 0) {
      throw new Error("No Applicants found.");
    }

    const count = await Applicant.countDocuments({});
    const checkedInCount = await Applicant.countDocuments({ checkIn: true });
    const overallPages = Math.floor(count / queryLimit);
    const currentQuery = applicants.length;

    if (currentPage > overallPages) {
      throw new Error("Out of range.");
    }

    return httpResponse.successResponse(res, {
      overallPages,
      currentQuery,
      count,
      currentPage,
      applicants,
      checkedInCount
    });
  } catch (e) {
    return httpResponse.failureResponse(res, e);
  }
};

const update = async (req, res) => {
  const { email } = req.query;

  try {
    const hasConfirmed = await Applicant.findOne({ email }).exec();

    if (!hasConfirmed.confirmation) {
      const confirm = await Applicant.findOneAndUpdate(
        { email },
        { confirmation: true },
        { new: true }
      ).exec();

      const confirmFields = {
        firstName: confirm.firstName,
        lastName: confirm.lastName,
        email: confirm.email,
        school: confirm.school,
        major: confirm.major,
        levelOfStudy: confirm.levelOfStudy,
        gender: confirm.gender,
        shirtSize: confirm.shirtSize,
        diet: confirm.diet,
        resume: confirm.resume
      };

      if (GOOGLE_SPREADSHEET_ID) {
        sheets.write("Confirmed", confirmFields);
      }

      httpResponse.successResponse(res, confirm);
    } else {
      httpResponse.successResponse(res, null);
    }
  } catch (e) {
    httpResponse.failureResponse(res, e);
  }
};


//accepts a single hacker from given email
const acceptOne = async (req,res) => {
  const {email} = req.body;

  try{
    const user = await Applicant.findOneAndUpdate(
      {email},
      {applicationStatus:"accepted"}
      ).exec();
      return httpResponse.successResponse(res,null)
  }
  
  catch(e){
    httpResponse.failureResponse(res, e);
  }
}

//accepts all hackers from a specific school
const acceptSchool = async (req,res) => {
  const {schoolName} = req.body;

  try{
    const users = await Applicant.updateMany(
      {schoolName},
      {"$set":{applicationStatus:"accepted"}}
      ).exec();
      return httpResponse.successResponse(res,null)
  }
  catch(e){
    httpResponse.failureResponse(res, e);
  }
}

//changes a single hacker's status from accepted to confirmed
const confirm = async (req,res) => {
  const {email} = req.body;

  try{
    const user = await Applicant.findOneAndUpdate(
      {email},
      {applicationStatus:"confirmed"}
      ).exec();
      return httpResponse.successResponse(res,null)
  }
  
  catch(e){
    httpResponse.failureResponse(res, e);
  }
}

const apply = async (req,res) => {
  fileService.extractResume(req, res, async err => {
    if (err) return httpResponse.failureResponse(res, err);
    const { file } = req;

    const{email,schoolName,levelOfStudy,
          graduationYear,major,gender,dob,race,phoneNumber,shirtSize,
          dietaryRestriction,firstTimeHack,howDidYouHear,
          favoriteEvents,areaOfFocus,resume,linkedIn,portfolio,github,
          reasonForAttending,haveBeenToShell,likeAMentor,
          needReimburesment,location} = req.body;
          
    
    //need to generate avatarID, ShellID, and Hash password
    const fields = {
      schoolName,
      levelOfStudy,
      graduationYear,
      major,
      gender,
      dob,
      race,
      phoneNumber,
      shirtSize,
      dietaryRestriction,
      firstTimeHack,
      howDidYouHear,
      favoriteEvents,
      areaOfFocus,
      resume,
      linkedIn,
      portfolio,
      github,
      reasonForAttending,
      haveBeenToShell,
      likeAMentor,
      applicationStatus: 'applied',
      needReimburesment,
      location,
      shirtSize,
    };

    try {
      if (!file) throw "Resume is required.";

      /**
       * Validate applicant fields
       */
      // await applicationService.validateHacker(fields);

      /**
       * Upload resume to google drive
       */
      const filename = fields.email.match(/.*?(?=@|$)/i)[0];

      fields.resume = "N/A";

      if (GOOGLE_FOLDER_ID) {
        const resumeUrl = await drive.upload(file, filename, GOOGLE_FOLDER_ID);
        fields.resume = resumeUrl;
      }

      /**
       * update applicant in the database
       */
      const user = await Applicant.findOneAndUpdate(
        {email},
        fields
        ).exec();

      /**
       * Send applicant email
       */
      mailService.applied(fields);

      /**
       * Insert applicant in google sheets
       */
      sheets.write("Applicants", fields);

      httpResponse.successResponse(res, applicant);
    } catch (e) {
      logger.info({ e, application: "Hacker", email: fields.email });
      httpResponse.failureResponse(res, e);
    }
  });
}

const login = async (req, res) => {
  try{
    const user = await Applicant.findOne({
      email
    })
  

    const correctPass = bcrypt.compareSync(password, user.password)
    if (!user || !correctPass)
      throw new Error('Wrong login info');

    const today = new Date();
    const expDate = new Date(today);
    expDate.setDate(today.getDate() + 60);

    let {shellID} = user;

    let JWT = await jwt.sign({
      shellID,
      exp:parseInt(expDate.getTime/1000,10),
    },'secret');

    httpResponse.successResponse(res, JWT);
    
  } catch(e){
    httpResponse.failureResponse(res, e);
  }
}

export default { create, read, update,confirm, acceptOne, acceptSchool, apply, login};
