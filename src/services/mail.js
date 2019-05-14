import nodemailer from "nodemailer";
import handlebars from "express-handlebars";
import mg from "nodemailer-mailgun-transport";
import nodemailerHandlebars from "nodemailer-express-handlebars";
import mc from "mailchimp-api-v3";

import logger from "../utils/logger";

const { POC_EMAIL, MAILGUN_KEY, MAILGUN_DOMAIN, MAILGUN_EMAIL, API_KEY } = process.env;

const auth = { auth: { api_key:MAILGUN_KEY, domain:MAILGUN_DOMAIN } };

const gun = nodemailer.createTransport(mg(auth));

const viewEngine = handlebars.create({});
const viewPath = "src/templates";

const mailchimp = new MailChimp(API_KEY);

gun.use("compile", nodemailerHandlebars({ viewEngine : { partialsDir: 'src/templates' }, viewPath }));

const applied = applicant => {
  // const mail = {
  //   from: POC_EMAIL,
  //   to: applicant.email,
  //   subject: `Sweet! You are now registered for MangoHacks!`,
  //   template: "applied",
  //   context: { firstName: applicant.firstName }
  // };
  // gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));

  mailchimp.post(`lists/${list_id}`, { members: [{ // send a post request to create new subscription to the list
    email_address:applicant.email,
    status: "subscribed"
}]
};

const workshop = applicant => {
  const mail = {
    from: `MangoHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `Super sweet! A MangoHacks Workshop.`,
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
    from: `MangoHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `Yay! A MangoHacks Mentor.`,
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
    from: `MangoHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `Wow! A MangoHacks Volunteer.`,
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
        from: `MangoHacks <${MAILGUN_EMAIL}>`,
        to: hacker.email,
        subject: `MangoHacks registration is live!`,
        template: "live"
      };

      logger.info({ message: `Live email sent to: ${hacker.email}` });

      return gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
    })
  );
};

const error = e => {
  const mail = {
    from: "MangoHacks",
    to: POC_EMAIL,
    subject: `Oops! Something went wrong`,
    html: e
  };
  return gun.sendMail(mail);
};

export default { applied, workshop, mentor, volunteer, live, error };
