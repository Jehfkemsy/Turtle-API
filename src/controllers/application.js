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
import { runInNewContext } from "vm";
import { http } from "winston";
import crypto from 'crypto'
import mailerService from '../services/nodemailer-temp'

const { GOOGLE_FOLDER_ID, GOOGLE_SPREADSHEET_ID, SECRET_KEY} = process.env;

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
   let unique;
   let id;
    do{
    id = createID.createId(5);
    console.log(id);
      
      unique = await Applicant.findOne({shellID: id})
      console.log(unique);
    }while(unique != null)

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
      resetPasswordToken: null,
      resetPasswordExpiration: null,
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
      // const applicant = await Applicant.create(fields);

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
  console.log('hit');
  const { page = 0, limit = 30, q } = req.query;
  console.log('query:' +q);
  console.log('page: '+page)

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
          { email: new RegExp(".*" + q + ".*", "i") },
          { schoolName: new RegExp(".*" + q + ".*", "i") }
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

    const count = await Applicant.countDocuments(searchCriteria);
    const checkedInCount = await Applicant.countDocuments({ checkIn: true });
    const overallPages = Math.ceil(count / queryLimit);
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
    console.log(e);
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
   const {email,password} = req.body;
  try{
    const user = await Applicant.findOne({
      email
    })

    if(!user)
      throw 'wrong login info'
  

    const correctPass = bcrypt.compareSync(password, user.password)
    if (!correctPass)
      throw 'Wrong login info';

    const expDate =  60 * 60 * 144

    let {shellID} = user;

    let JWT = await jwt.sign(
      {key:shellID},
      SECRET_KEY,
      {expiresIn:expDate}
    );

    httpResponse.successResponse(res, JWT);
    
  } catch(e){
    httpResponse.failureResponse(res, e);
    console.log(e);
  }
}

const unconfirm = async (req, res) =>
{
  try{
    const email = req.body.email;

    const unconfirmation = await Applicant.findOneAndUpdate(
      {email},
      {applicationStatus : "Accepted"}
    ).exec();
    httpResponse.successResponse(res, unconfirmation);
  }catch(e)
  {
    logger.info({ e, application: "Hacker", email: email });
    console.log(e);
    httpResponse.failureResponse(res, e)
  }

  
}

const checkIn = async (req,res) => {
  const {shellID} = req.body

  try{
    const checkedIn = await Applicant.findOneAndUpdate(
      {shellID},
      {checkIn: true}
    ).exec()

    httpResponse.successResponse(res,checkedIn);
  }catch(e){
    httpResponse.failureResponse(res,e)
  }
}

const forgotPassword = async (req,res) => {  

  try{
    const {email} = req.body;

    const emailFound = await Applicant.findOne({email: email});

    if(!emailFound){
      throw 'User email does not exist';
    }

    const token = await crypto.randomBytes(6).toString('hex');

    const date = new Date();
    const tomorrow = await date.setTime(date.getTime() + (24 * 60 * 60 * 1000))

    const applicant = await Applicant.findOneAndUpdate({email: email},{
      resetPasswordToken: token,
      resetPasswordExpiration: tomorrow
    })

    mailerService.forgotPassword(email,token);

    httpResponse.successResponse(res,"Reset password email sent");
  }
  catch(err){
    console.log(err)
    httpResponse.failureResponse(res,err);
  }
}

const resetPassword = async (req,res) => {
    try{
      const {email, newPassword, token} = req.body;

      await applicationService.resetPasswordValidation(email, newPassword, token);

      const password = bcrypt.hashSync(newPassword)

      const updatedApplicant = await Applicant.findOneAndUpdate({email: email},
        {
          resetPasswordToken: null,
          resetPasswordExpiration: null,
          password: password,
        });

        if(!updatedApplicant) throw "Error, try again later"

      
      httpResponse.successResponse(res,"Email succesfully reset");

    }
    catch(err){
      console.log(err)
      httpResponse.failureResponse(res,err);
    }
}

export default { create, read, update,confirm, acceptOne, acceptSchool, apply, unconfirm, login, forgotPassword,resetPassword, checkIn};

