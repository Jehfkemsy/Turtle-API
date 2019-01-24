import applicationService from "../services/application";

import logger from "../utils/logger";
import httpResponse from "../utils/httpResponses";

import Candidate from "../models/candidate";
import Applicant from '../models/applicant';


const create = async (req, res) => {
		let { hacker, company } = req.body;
	
		const applicant = await Applicant.findOne({email: hacker.email});
		const { firstName, lastName, email, levelOfStudy, resume } = applicant;

	try{
		const candidateObj = {firstName, lastName, email, levelOfStudy, resume, company};
		await applicationService.validateCandidate(candidateObj);
		const candidate = await Candidate.create();
	
		httpResponse.successResponse(res, candidate);

	} catch(e) {
		logger.info({ e, application: "Candidate" });
		httpResponse.failureResponse(res, e);
	}
};
const read = (req, res) => {};

export default { create, read };
