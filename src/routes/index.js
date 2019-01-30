import { Router } from "express";

import application from "../controllers/application";
import volunteer from "../controllers/volunteer";
import candidate from "../controllers/candidate";
import workshop from "../controllers/workshop";
import cabinet from "../controllers/cabinet";
import mentor from "../controllers/mentor";
import token from "../controllers/token";
import live from "../controllers/live";

//Middleware
import tokenAuthMiddleware from "../middleware/tokenAuthMiddleware";

const apiRouter = Router();

apiRouter.get("/", (req, res) => res.send("biensupernice."));

/* ------ Application Routes ------ */
apiRouter.post("/application", application.create);
apiRouter.get(
  "/application",
  tokenAuthMiddleware.validateToken,
  application.read
);
apiRouter.put("/application", application.update);

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
apiRouter.get(
  "/cabinet/males",
  tokenAuthMiddleware.validateToken,
  cabinet.males
);
apiRouter.get(
  "/cabinet/females",
  tokenAuthMiddleware.validateToken,
  cabinet.females
);
apiRouter.get(
  "/cabinet/confirmed",
  tokenAuthMiddleware.validateToken,
  cabinet.confirmed
);
apiRouter.get(
  "/cabinet/unconfirmed",
  tokenAuthMiddleware.validateToken,
  cabinet.unconfirmed
);
apiRouter.get("/cabinet/download", cabinet.download);

/* ------ Prereg signup Route ------ */
// Deprecating this route, this alert is no longer needed
// apiRouter.post("/live", live.create);

/* ------ Token Route ------ */
apiRouter.post("/token", token.create);

export { apiRouter };
