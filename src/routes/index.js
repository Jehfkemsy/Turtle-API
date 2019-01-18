import { Router } from "express";

import application from "../controllers/application";
import volunteer from "../controllers/volunteer";
import workshop from "../controllers/workshop";
import mentor from "../controllers/mentor";
import token from "../controllers/token";
import live from "../controllers/live";
//Middleware
import tokenAuthMiddleware from '../middleware/tokenAuthMiddleware';

const apiRouter = Router();

apiRouter.get("/", (req, res) => res.send("biensupernice."));

/* ------ Application Routes ------ */
apiRouter.post("/application", application.create);
apiRouter.get("/application", application.read);

/* ------ Workshop Routes ------ */
apiRouter.post("/workshop", workshop.create);

/* ------ Mentor Routes ------ */
apiRouter.post("/mentor", mentor.create);

/* ------ Volunteer Routes ------ */
apiRouter.post("/volunteer", volunteer.create);

/* ------ Prereg signup Route ------ */
apiRouter.post("/live", live.create);

/* ------ Token Route ------ */
apiRouter.post("/token", token.create);

export { apiRouter };
