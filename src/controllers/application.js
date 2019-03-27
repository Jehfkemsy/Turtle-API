import mailService from "../services/mail";
import fileService from "../services/file";
import drive from "../services/google/drive";
import sheets from "../services/google/sheets";
import applicationService from "../services/application";

import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";

import Applicant from "../models/applicant";

const { GOOGLE_FOLDER_ID, GOOGLE_SPREADSHEET_ID } = process.env;

const create = async (req, res) => {
  
  fileService.extractResume(req, res, async err => {
    if (err) return httpResponse.failureResponse(res, err);
    console.log('test')
    // const { file } = req;
    const{firstName,lastName,email,school,major,levelOfStudy,gender,shirtSize,
      diet} = req.body;

    const fields = {
      firstName,
      lastName,
      email,
      school,
      major,
      levelOfStudy,
      gender,
      shirtSize,
      diet
    };

    try {
      // if (!file) throw "Resume is required.";

      /**
       * Validate applicant fields
       */
      // await applicationService.validateHacker(fields);

      /**
       * Upload resume to google drive
       */
      // const filename = fields.email.match(/.*?(?=@|$)/i)[0];

      // fields.resume = "N/A";

      // if (GOOGLE_FOLDER_ID) {
      //   const resumeUrl = await drive.upload(file, filename, GOOGLE_FOLDER_ID);
      //   fields.resume = resumeUrl;
      // }

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
      logger.info({ e, application: "Hacker", email: fields.email });
      httpResponse.failureResponse(res, e);
    }
  });
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

export default { create, read, update };
