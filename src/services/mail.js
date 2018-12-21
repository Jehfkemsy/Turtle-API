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

const error = e => {
  const mail = {
    from: "MangoHacks",
    to: POC_EMAIL,
    subject: `⚠️ Oops! Something went wrong`,
    html: e
  };
  return gun.sendMail(mail);
};

export default { applied, error };
