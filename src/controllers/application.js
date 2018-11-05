import fileService from "../services/file";
import drive from "../services/drive";

const create = (req, res) => {
  fileService.extractResume(req, res, async err => {
    if (err) return httpResponse.failureResponse(res, err);
    const { file } = req;

    try {
      const resumePath = await fileService.saveBuffer(file);
      file.path = resumePath;
      const resumeUrl = await drive.uploadResume(file);

      await fileService.cleanup(resumePath);
      res.send(resumeUrl);
    } catch (e) {
      res.send(e);
    }
  });
};

const read = (req, res) => {};
const update = (req, res) => {};
const remove = (req, res) => {};

export default { create, read, update, remove };
