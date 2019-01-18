import mailService from "../services/mail";
import fileService from "../services/file";
import drive from "../services/google/drive";
import sheets from "../services/google/sheets";
import applicationService from "../services/application";

import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";

import Applicant from "../models/applicant";

const create = async (req, res) => {
  fileService.extractResume(req, res, async err => {
    if (err) return httpResponse.failureResponse(res, err);
    const { file } = req;

    const fields = {
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      school: req.body.school,
      major: req.body.major,
      levelOfStudy: req.body.levelOfStudy,
      gender: req.body.gender,
      shirtSize: req.body.shirtSize,
      diet: req.body.diet || "N/A"
    };

    try {
      if (!file) throw "Resume is required.";

      /**
       * Validate applicant fields
       */
      await applicationService.validateHacker(fields);

      /**
       * Upload resume to google drive
       */
      const filename = fields.email.match(/.*?(?=@|$)/i)[0];
      const resumeUrl = await drive.upload(file, filename);
      fields.resume = resumeUrl;

      /**
       * Insert applicant in the database
       */
      const applicant = await Applicant.create(fields);

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
};

const read = async (req, res) => {
  const { page = 0, limit = 30 } = req.params;

  const queryLimit = parseInt(Math.abs(limit));
  const pageQuery = parseInt(Math.abs(page)) * queryLimit;

  const currentPage = pageQuery / queryLimit;

  try {
    const applicants = await Applicant.find({}, { _id: 0, __v: 0 })
      .skip(pageQuery)
      .limit(queryLimit)
      .sort({ timestamp: -1 });

    const count = await Applicant.countDocuments({});
    const overallPages = Math.floor(count / queryLimit);
    const currentQuery = applicants.length;

    applicants.length <= 0 && reject("No Applicants found.");
    currentPage > overallPages && reject("Out of range.");

    httpResponse.successResponse(res, {
      overallPages,
      currentQuery,
      count,
      currentPage,
      applicants
    });
  } catch (e) {
    httpResponse.failureResponse(res, e);
  }
};

export default { create, read };
