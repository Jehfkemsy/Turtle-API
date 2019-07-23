/**
 * Handles all outgoing emails
 */
import nodemailer from "nodemailer";
import handlebars from "express-handlebars";
import mg from "nodemailer-mailgun-transport";
import nodemailerHandlebars from "nodemailer-express-handlebars";

import logger from "../utils/logger";

const { POC_EMAIL, MAILGUN_KEY, MAILGUN_DOMAIN, MAILGUN_EMAIL } = process.env;

const auth = { auth: { api_key: MAILGUN_KEY, domain: MAILGUN_DOMAIN } };

const gun = nodemailer.createTransport(mg(auth));
// Default layout has to be set to null and a path has to be defined even if you aren't using layouts
const viewEngine = handlebars.create({
  partialsDir: "src/templates",
  layoutsDir: "src/templates",
  defaultLayout: null,
});
const viewPath = "src/templates";

gun.use("compile", nodemailerHandlebars({ viewEngine, viewPath }));

/**
 * sends email verification code
 * @param {Object} applicant
 */
const emailVerification = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `You are now registered for Shell Hacks`,
    template: "verify_email",
    context: { emailConfirmationToken: applicant.emailConfirmationToken },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * confirms user account has been created
 * @param {Object} applicant
 */
const accountConfirmation = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `Your ShellHacks Account Has Been Created`,
    template: "account_confirmation",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * reminds user to submit application
 * @param {Object} applicant
 */
const applicationReminder = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `Please submit your application ASAP`,
    template: "application_reminder",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * confirms user application has been submitted
 * @param {Object} applicant
 */
const applicantionConfirmation = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `We've received your application`,
    template: "application_confirmation",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * reminds user to confirm that they're coming
 * @param {Object} applicant
 */
const acceptReminder = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `Don't Forgot to Confirm Your Attendance`,
    template: "acceptance_confirmation_reminder",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * let user know that they've been accepted
 * @param {Object} applicant
 */
const accepted = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `You've Been Accepted to ShellHacks`,
    template: "acceptance",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * confirms user's confirmation has successfully submitted
 * @param {Object} applicant
 */
const acceptedConfirmation = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `You are All Set For ShellHacks`,
    template: "accepted_confirmation",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * sends token to reset password
 * @param {Object} applicant
 */
const forgotPassword = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `Here's your Reset Token`,
    template: "forgot_password",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
    },
  };
  gun.sendMail(mail, (err, info) => (err ? console.log(err) : info));
};

/**
 * confirmation that account has been reset
 * @param {Object} applicant
 */
const resetPassword = applicant => {
  const mail = {
    from: `ShellHacks <${MAILGUN_EMAIL}>`,
    to: applicant.email,
    subject: `Your Password Has Been Updated`,
    template: "reset_password",
    context: {
      firstName: applicant.firstName,
      lastName: applicant.lastName,
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
  workshop,
  mentor,
  volunteer,
  live,
  error,
};
