import userService from "../services/user";
import httpResponse from "../responses/httpResponses";

const create = async (req, res) => {
  try {
    const { email, password } = req.body;

    const token = await userService.auth(email, password);

    httpResponse.successResponse(res, { token });
  } catch (e) {
    httpResponse.failureResponse(res, e);
  }
};

export default { create };
