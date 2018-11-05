import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import User from "../models/user";
import userResponse from "../responses/userResponses";

const { JWT_SECRET } = process.env;

const createJWT = userId =>
  jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: "24h" });

const validatePassword = password =>
  new Promise((resolve, reject) => {
    if (!password) reject(userResponse.noPassword);
    if (password.length < 7) reject(userResponse.passwordLength);

    const regex = /^(?=.*\d)(?=.*[!@#$%^&*])(?=.*[a-z])(?=.*[A-Z]).{8,}$/;
    const isValid = regex.test(password);

    if (!isValid) reject(userResponse.invalidPassword);

    resolve(password);
  });

const validateEmail = email =>
  new Promise((resolve, reject) => {
    const regex = /\S+@\S+\.\S+/;
    const isValid = regex.test(email);
    if (!isValid) reject(userResponse.invalidEmail);

    resolve(email);
  });

const create = (email, password) =>
  new Promise(async (resolve, reject) => {
    try {
      const validEmail = await validateEmail(email);
      const validPassword = await validatePassword(password);

      const hashedPW = await bcrypt.hash(validPassword, 10);
      const { id } = await User.create({ email, password: hashedPW });

      const token = createJWT(id);

      resolve(token);
    } catch (e) {
      reject(e);
    }
  });

const auth = (email, password) =>
  new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email });

      if (!user) reject(userResponse.notFound);

      const match = await bcrypt.compare(password, user.password);

      if (!match) reject(userResponse.incorrectPassword);

      const token = createJWT(user.id);

      resolve(token);
    } catch (e) {
      reject(e);
    }
  });

export default { create, auth };
