import nodemailer from "nodemailer";
import handlebars from "express-handlebars";
import mg from "nodemailer-mailgun-transport";
import nodemailerHandlebars from "nodemailer-express-handlebars";

import logger from "../utils/logger";

const { POC_EMAIL, MAILGUN_KEY, MAILGUN_DOMAIN, MAILGUN_EMAIL } = process.env;

const auth = { auth: { api_key: MAILGUN_KEY, domain: MAILGUN_DOMAIN } };

const gun = nodemailer.createTransport(mg(auth));
// Default layout has to be set to null and a path has to be defined even if you aren't using layouts
const viewEngine = handlebars.create({partialsDir: 'src/templates', layoutsDir: "src/templates", defaultLayout: null});
const viewPath = "src/templates";

gun.use("compile", nodemailerHandlebars({ viewEngine, viewPath }));

const applied = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `You are now registered for Shell Hacks`,
    template: "applied_new",
    context: { firstName: applicant.firstName }
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

const workshop = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `ShellHacks Workshop`,
    template: "workshop",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      title: applicant.title,
      description: applicant.description
    }
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

const mentor = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `Mentor for ShellHacks`,
    template: "mentor",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      skills: applicant.skills
    }
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

const volunteer = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `Volunteer for ShellHacks.`,
    template: "volunteer",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      email: applicant.email
    }
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

const live = hackers => {
  return Promise.all(
    hackers.map(hacker => {
      const mail = {
        from: `ShellHacks <${MAILGUN_EMAIL}>`,
        to: hacker.email,
        subject: `ShellHacks registration is live!`,
        template: "live"
      };

      logger.info({ message: `Live email sent to: ${hacker.email}` });

      return gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
    })
  );
};

const error = e => {
  const mail = {
    from: "ShellHacks",
    to: POC_EMAIL,
    subject: `Oops! Something went wrong`,
    html: e
  };
  return gun.sendMail(mail);
};

export default { applied, workshop, mentor, volunteer, live, error };
