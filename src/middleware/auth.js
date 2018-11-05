import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import jwt from "jsonwebtoken";

import User from "../models/user";

const { JWT_SECRET } = process.env;

passport.use(
  new BearerStrategy(async (token, done) => {
    try {
      const { id } = await jwt.verify(token, JWT_SECRET);
      const user = await User.findById(id);

      return done(null, user);
    } catch (err) {
      return done(null, false);
    }
  })
);

const authMiddleware = passport.authenticate("bearer", { session: false });

export default authMiddleware;
