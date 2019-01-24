import applicationService from "../services/application";
import drive from "../services/google/drive";
import sheets from "../services/google/sheets";

import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";

import Candidate from "../models/candidate";
import Applicant from '../models/applicant';

const { CARNIVAL_FOLDER_ID, EXPRESS_FOLDER_ID, GE_FOLDER_ID } = process.env;

const create = async (req, res) => {
		let { hacker, company } = req.body;
	
		const applicant = await Applicant.findOne({email: hacker.email});
		const { firstName, lastName, email, levelOfStudy, resume } = applicant;
		
	try{
		const candidate = await Candidate.create({firstName, lastName, email, levelOfStudy, resume, company});
	
		await applicationService.validateCandidate(candidate);
		httpResponse.successResponse(res, candidate);

	} catch(e) {
		logger.info({ e, application: "Candidate" });
		httpResponse.failureResponse(res, e);
	}
};
const read = (req, res) => {};

export default { create, read };
