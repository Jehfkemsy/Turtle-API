import nodemailer from "nodemailer";
import handlebars from "express-handlebars";
import nodemailerHandlebars from "nodemailer-express-handlebars";

const { EMAIL_USER, EMAIL_PASSWORD } = process.env;

let mailer = nodemailer.createTransport({
  service: "gmail",
  auth: { user: EMAIL_USER, pass: EMAIL_PASSWORD }
});

const viewEngine = handlebars.create({});
const viewPath = "src/templates";

mailer.use("compile", nodemailerHandlebars({ viewEngine, viewPath }));

const applied = applicant => {
  const mail = {
    from: EMAIL_USER,
    to: applicant.email,
    subject: `🥭 Sweet! You are now registered for MangoHacks!`,
    template: "applied",
    context: { firstName: applicant.firstName }
  };
  return mailer.sendMail(mail);
};

export default { applied };
