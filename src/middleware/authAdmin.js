import jwt from "jsonwebtoken";

import User from "../models/user";

const { JWT_SECRET } = process.env;

const authAdmin = async (req, res, next) => {
  const { authorization } = req.headers;

  if (!authorization) return res.status(401).send("Unauthorized");

  const token = authorization.split(" ")[1];

  try {
    const { id } = await jwt.verify(token, JWT_SECRET);
    const user = await User.findById(id);

    if (user.role !== "admin") return res.status(401).send("Unauthorized");

    req.user = user;
    next();
  } catch (e) {
    return res.status(401).send("Unauthorized");
  }
};

export default authAdmin;
