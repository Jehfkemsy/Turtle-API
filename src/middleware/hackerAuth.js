
import passport from "passport";
import { Strategy as BearerStrategy } from "passport-http-bearer";
import jwt from "jsonwebtoken";

const { SECRET_KEY, DASHBOARD_PASSWORD } = process.env;

passport.use(
  "hacker-rule",
  new BearerStrategy(async (token, done) => {
    let decoded;
    try {
      decoded = await jwt.verify(token, SECRET_KEY);
      return done(null, true);
    } 
    catch (err) {
      return done(null, false);
    }
  })
);

const hackerAuthMiddleware = passport.authenticate("hacker-rule", {
  session: false
});

export default hackerAuthMiddleware;