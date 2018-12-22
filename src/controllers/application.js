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

export default { create };
