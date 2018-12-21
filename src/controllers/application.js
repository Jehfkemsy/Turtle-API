import fileService from "../services/file";

import drive from "../services/google/drive";
import sheets from "../services/google/sheets";

import Applicant from "../models/applicant";

import httpResponse from "../responses/httpResponses";

import mailService from "../services/mail";

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

    mailService.applied(fields);

    // try {
    //   const isValidApplicant = await Applicant.findOne({ email: fields.email });

    //   if (isValidApplicant) throw "Applicant is already signed up.";

    //   if (!file) throw "Resume is required.";

    //   const filename = fields.email.match(/.*?(?=@|$)/i)[0];
    //   const resumeUrl = await drive.upload(file, filename);
    //   fields.resume = resumeUrl;

    //   const applicant = await Applicant.create(fields);

    //   mailService.applied(fields);
    //   sheets.write("Applicants", fields);

    //   res.send({ success: true, data: applicant });
    // } catch (e) {
    //   console.log({ e, fields });
    //   res.send({ success: false, message: e });
    // }
  });
};

const read = (req, res) => {};
const update = (req, res) => {};
const remove = (req, res) => {};

export default { create, read, update, remove };
