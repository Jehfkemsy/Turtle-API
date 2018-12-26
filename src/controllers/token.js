import jwt from "jsonwebtoken";

import httpResponse from "../utils/httpResponses";

const { DASHBOARD_PASSWORD } = process.env;

const create = (req, res) => {
  const { password } = req.body;

  const token = jwt.sign({ key: DASHBOARD_PASSWORD }, DASHBOARD_PASSWORD);

  if (password == DASHBOARD_PASSWORD) {
    return httpResponse.successResponse(res, { token });
  }

  httpResponse.failureResponse(res, "Incorrect Password.");
};

export default { create };
