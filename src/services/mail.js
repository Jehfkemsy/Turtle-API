import nodemailer from "nodemailer";
import handlebars from "express-handlebars";
import mg from "nodemailer-mailgun-transport";
import nodemailerHandlebars from "nodemailer-express-handlebars";

const { POC_EMAIL, MAILGUN_KEY, MAILGUN_DOMAIN, MAILGUN_EMAIL } = process.env;

const auth = { auth: { api_key: MAILGUN_KEY, domain: MAILGUN_DOMAIN } };

const gun = nodemailer.createTransport(mg(auth));

const viewEngine = handlebars.create({});
const viewPath = "src/templates";

gun.use("compile", nodemailerHandlebars({ viewEngine, viewPath }));

const applied = applicant => {
  const mail = {
    from: `MangoHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `🥭 Sweet! You are now registered for MangoHacks!`,
    template: "applied",
    context: { firstName: applicant.firstName }
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

const workshop = applicant => {
  const mail = {
    from: `MangoHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `🍰 Super sweet! A MangoHacks Workshop.`,
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
    subject: `🧁 Yay! A MangoHacks Mentor.`,
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
    subject: `🍦 Wow! A MangoHacks Volunteer.`,
    template: "volunteer",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      email: applicant.email
    }
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

const error = e => {
  const mail = {
    from: "MangoHacks",
    to: POC_EMAIL,
    subject: `⚠️ Oops! Something went wrong`,
    html: e
  };
  return gun.sendMail(mail);
};

export default { applied, workshop, mentor, volunteer, error };
