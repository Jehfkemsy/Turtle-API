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

import authMiddleware from "../middleware/auth";

const apiRouter = Router();

apiRouter.get("/", (req, res) => res.send("biensupernice."));

/* ------ Application Routes ------ */
apiRouter.post("/application", application.create);
apiRouter.get("/application", authMiddleware, application.read);
apiRouter.put("/application", application.update);

/* ------- Day of Routes --------*/
apiRouter.post("/walkin", authMiddleware, walkIn.create);
apiRouter.post("/checkin", authMiddleware, checkin.create);

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
apiRouter.get("/cabinet/males", authMiddleware, cabinet.males);
apiRouter.get("/cabinet/females", authMiddleware, cabinet.females);
apiRouter.get("/cabinet/confirmed", authMiddleware, cabinet.confirmed);
apiRouter.get("/cabinet/unconfirmed", authMiddleware, cabinet.unconfirmed);
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
