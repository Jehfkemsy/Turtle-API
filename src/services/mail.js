/**
 * Handles outgoing emails using domain named email address with mailgun
 */
import nodemailer from "nodemailer";
import handlebars from "express-handlebars";
import mg from "nodemailer-mailgun-transport";
import nodemailerHandlebars from "nodemailer-express-handlebars";

import logger from "../utils/logger";

const { POC_EMAIL, MAILGUN_KEY, MAILGUN_DOMAIN, MAILGUN_EMAIL } = process.env;

const auth = { auth: { api_key: MAILGUN_KEY, domain: MAILGUN_DOMAIN } };

const gun = nodemailer.createTransport(mg(auth));

const path = require("path");
const viewEngine = handlebars.create({
  //Default layout has to be set to null and a path
  //has to be defined even if you aren't using layouts
  partialsDir: path.resolve("src/templates"),
  layoutsDir: path.resolve("src/templates"),
  defaultLayout: null,
});

const viewPath = path.resolve("src/templates");
gun.use("compile", nodemailerHandlebars({ viewEngine, viewPath }));

/**
 * Sends user email verification code
 * @param {Object} applicant - user application model
 */
const emailVerification = ({ email, emailConfirmationToken }) => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: email,
    subject: "You are now registered for Shell Hacks",
    template: "verify_email",
    context: { emailConfirmationToken: emailConfirmationToken },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * Confirms user account has been created
 * @param {Object} applicant - user application model
 */
const accountConfirmation = ({ email, firstName, lastName }) => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: email,
    subject: `Your ShellHacks Account Has Been Created`,
    template: "account_confirmation",
    context: {
      firstName: firstName,
      lastName: lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * Reminds user to submit application
 * @param {Object} applicant - user application model
 */
const applicationReminder = ({ email, firstName, lastName }) => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: email,
    subject: `Please submit your application ASAP`,
    template: "application_reminder",
    context: {
      firstName: firstName,
      lastName: lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * Confirms user application has been submitted
 * @param {Object} applicant - user application model
 */
const applicantionConfirmation = ({ email, firstName, lastName }) => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: email,
    subject: `We've received your application`,
    template: "application_confirmation",
    context: {
      firstName: firstName,
      lastName: lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * Reminds user to confirm that they're attending
 * @param {Object} applicant - user application model
 */
const acceptReminder = ({ email, firstName, lastName }) => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: email,
    subject: `Don't Forgot to Confirm Your Attendance`,
    template: "acceptance_confirmation_reminder",
    context: {
      firstName: firstName,
      lastName: lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * Let user know that they've been accepted
 * @param {Object} applicant - user application model
 */
const accepted = ({ email, firstName, lastName }) => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: email,
    subject: `You've Been Accepted to ShellHacks`,
    template: "acceptance",
    context: {
      firstName: firstName,
      lastName: lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * Confirms user's attendance confirmation has been successfully submitted
 * @param {Object} applicant - user application model
 */
const acceptedConfirmation = ({ email, firstName, lastName }) => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: email,
    subject: `You are All Set For ShellHacks`,
    template: "accepted_confirmation",
    context: {
      firstName: firstName,
      lastName: lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * Sends token to reset password
 * @param {Object} applicant - user application model
 */
const forgotPassword = ({ email, firstName, lastName }) => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: email,
    subject: `Here's your Reset Token`,
    template: "forgot_password",
    context: {
      firstName: firstName,
      lastName: lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * Confirmation that account password has been reset
 * @param {Object} applicant - user application model
 */
const resetPassword = ({ email, firstName, lastName }) => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: email,
    subject: `Your Password Has Been Updated`,
    template: "reset_password",
    context: {
      firstName: firstName,
      lastName: lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * Sends a custom email with passed parameters values
 * @param {String} email - user email address
 * @param {String} subject - email subject
 * @param {String} firstName - user first name
 * @param {String} lastName - user last name
 * @param {String} title - body title
 * @param {String} paragraph - body
 * @param {String} action - action button label ... if null, no button if shown
 * @param {String} actionURL - action button link
 */
const customMail = (
  email,
  subject,
  firstName,
  lastName,
  title,
  paragraph,
  action,
  actionURL
) => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: email,
    subject: subject || "Update From ShellHacks",
    template: "custom",
    context: {
      firstName: firstName,
      lastName: lastName,
      title,
      paragraph: paragraph,
      action: action,
      actionURL: actionURL,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

//NOT YET DOCUMENTED ---------------------------------------------------------------------------------------------------------------------------
const workshop = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `ShellHacks Workshop`,
    template: "applied_new",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      title: applicant.title,
      description: applicant.description,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

const mentor = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `Mentor for ShellHacks`,
    template: "applied_new",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      skills: applicant.skills,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

const volunteer = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `Volunteer for ShellHacks.`,
    template: "applied_new",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
      email: applicant.email,
    },
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
        template: "applied_new",
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
    html: e,
  };
  return gun.sendMail(mail);
};

export default {
  emailVerification,
  accountConfirmation,
  forgotPassword,
  resetPassword,
  applicationReminder,
  applicantionConfirmation,
  accepted,
  acceptReminder,
  acceptedConfirmation,
  customMail,
  workshop,
  mentor,
  volunteer,
  live,
  error,
};
