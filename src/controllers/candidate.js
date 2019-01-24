import applicationService from "../services/application";
import drive from "../services/google/drive";
import sheets from "../services/google/sheets";

import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";

import Candidate from "../models/candidate";

const { CARNIVAL_FOLDER_ID, EXPRESS_FOLDER_ID, GE_FOLDER_ID } = process.env;

const create = (req, res) => {
  fileService.extractResume(req, res, async err => {
    if (err) return httpResponse.failureResponse(res, err);
    const { file } = req;

    let company_name;

    const { hacker, company } = req.body;

    switch (company.toLowerCase()) {
      case "carnival":
        company_name = CARNIVAL_FOLDER_ID;
        break;
      case "express":
        company_name = EXPRESS_FOLDER_ID;
        break;
      case "ge":
        company_name = GE_FOLDER_ID;
        break;
      default:
        company_name = null;
    }

    // find by email
    // create candidate model
    /**
     * {
     * applicant.firstname
     * applicant.lastname
     * company
     * .....
     * }
     */

    // create candidate model
    // candidate.create(obj)

    try {
      if (!file) throw "Resume is required.";
      if (!folder_id) throw "Something went wrong. Company not found.";

      /**
       * Validate applicant fields
       */
      await applicationService.validateCandidate(hacker);

      /**
       * Upload resume to google drive
       */
      const filename = fields.email.match(/.*?(?=@|$)/i)[0];
      const resumeUrl = await drive.upload(file, filename, folder_id);
      hacker.resume = resumeUrl;

      /**
       * Insert applicant in the database
       */
      const candidate = await Candidate.create(hacker);

      httpResponse.successResponse(res, candidate);
    } catch (e) {
      logger.info({ e, application: "Candidate" });
      httpResponse.failureResponse(res, e);
    }
  });
};
const read = (req, res) => {};

export default { create, read };
