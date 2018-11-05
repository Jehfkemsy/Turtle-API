import User from "../models/user";
import userService from "../services/user";
import httpResponses from "../responses/httpResponses";
import userResponse from "../responses/userResponses";

const create = async (req, res) => {
  const { email, password } = req.body;

  if (!email) return httpResponses.failureResponse(res, userResponse.noEmail);
  if (!password)
    return httpResponses.failureResponse(res, userResponse.noPassword);

  try {
    const token = await userService.create(email, password);

    httpResponses.successResponse(res, { token });
  } catch (e) {
    httpResponses.failureResponse(res, e);
  }
};

const read = async (req, res) => {
  const { id } = req.params;

  if (!id) return httpResponses.failureResponse(res, userResponse.notFound);

  try {
    const exclude = { password: 0, __v: 0 };
    const user = await User.findById(id, exclude);

    httpResponses.successResponse(res, user);
  } catch (e) {
    httpResponses.failureResponse(res, e);
  }
};

const update = (req, res) => {};

const remove = async (req, res) => {
  const { id } = req.params;
  const admin = req.user;
  if (admin.id == id)
    return httpResponses.failureResponse(res, userResponse.selfRemoval);

  try {
    await User.findOneAndDelete(id);

    httpResponses.successResponse(res, null);
  } catch (e) {
    httpResponses.failureResponse(res, e);
  }
};

export default { create, read, update, remove };
