import jwt from "jsonwebtoken";

import httpResponse from "../utils/httpResponses";

const { SECRET_KEY, DASHBOARD_PASSWORD } = process.env;

const create = (req, res) => {
  const { password } = req.body;
  console.log(password);
  let expiresIn = 60 * 60 * 144; // 144 hours

  if (password == DASHBOARD_PASSWORD) {
    const token = jwt.sign({ key: DASHBOARD_PASSWORD }, SECRET_KEY, {
      expiresIn: expiresIn // expire in 6 hours
    });

    return httpResponse.successResponse(res, {
      token,
      expiresIn: expiresIn
    });
  }

  httpResponse.failureResponse(res, "Incorrect Password.");
};

export default { create };
