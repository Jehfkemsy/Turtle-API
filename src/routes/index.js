import { Router } from "express";

import application from "../controllers/application";

const apiRouter = Router();

apiRouter.get("/", (req, res) => res.send("biensupernice."));

/* ------ Application Routes ------ */
apiRouter.post("/application", application.create);

export { apiRouter };
