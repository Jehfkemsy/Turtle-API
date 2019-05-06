import { Router } from "express";

import announcement from "../controllers/announcement";
import application from "../controllers/application";
import volunteer from "../controllers/volunteer";
import candidate from "../controllers/candidate";
import workshop from "../controllers/workshop";
import cabinet from "../controllers/cabinet";
import mentor from "../controllers/mentor";
import token from "../controllers/token";
import live from "../controllers/live";
import walkIn from "../controllers/walkIn";
import checkin from "../controllers/checkin";

import adminAuthMiddleware from "../middleware/adminAuth";
import hackerAuthMiddleware from '../middleware/hackerAuth';

const apiRouter = Router();

apiRouter.get("/", (req, res) => res.send("biensupernice."));

/* ------ Application Routes ------ */
apiRouter.get("/application", adminAuthMiddleware, application.read);
apiRouter.post("/application", application.create);
apiRouter.post("/application/login", application.login);
apiRouter.put("/application/confirm",hackerAuthMiddleware, application.confirm);
apiRouter.put("/application", hackerAuthMiddleware, application.update);
apiRouter.put("/application/apply",hackerAuthMiddleware, application.apply);
apiRouter.put("/application/unconfirm", hackerAuthMiddleware, application.unconfirm);
apiRouter.put("/application/forgot_password",application.forgotPassword);
apiRouter.put("/application/reset_password",application.resetPassword);
apiRouter.post("/application/:email/:token",application.confirmEmail);

/* ------ Administrator Routes ------ */
apiRouter.put("/admin/acceptOne",adminAuthMiddleware,application.acceptOne);
apiRouter.put("/admin/acceptSchool",adminAuthMiddleware,application.acceptSchool);
apiRouter.put("/admin/checkIn",adminAuthMiddleware,application.checkIn);

/* ------- Day of Routes --------*/
apiRouter.post("/walkin", adminAuthMiddleware, walkIn.create);
apiRouter.post("/checkin", adminAuthMiddleware, checkin.create);

/* ------ Workshop Routes ------ */
apiRouter.post("/workshop", workshop.create);

/* ------ Mentor Routes ------ */
apiRouter.post("/mentor", mentor.create);

/* ------ Volunteer Routes ------ */
apiRouter.post("/volunteer", volunteer.create);

/* ------ Interview/Candidate Routes ------ */
apiRouter.post("/candidate", candidate.create);
apiRouter.get("/candidate", candidate.read);

/* ------Cabinet Routes ------ */
apiRouter.get("/cabinet/statistics", adminAuthMiddleware, cabinet.statistics);
apiRouter.get("/cabinet/males", adminAuthMiddleware, cabinet.males);
apiRouter.get("/cabinet/females", adminAuthMiddleware, cabinet.females);
apiRouter.get("/cabinet/confirmed", adminAuthMiddleware, cabinet.confirmed);
apiRouter.get("/cabinet/unconfirmed", adminAuthMiddleware, cabinet.unconfirmed);
apiRouter.get("/cabinet/download", cabinet.download);
apiRouter.get("/cabinet/checkin", cabinet.checkedIn);

/* ------ Live-Site Announcements ------ */
apiRouter.post("/announcement", announcement.create);
apiRouter.get("/announcement", announcement.read);

/* ------ Prereg signup Route ------ */
// Deprecating this route, this alert is no longer needed
// apiRouter.post("/live", live.create);

/* ------ Token Route ------ */
apiRouter.post("/token", token.create);

export { apiRouter };
