import { Router } from "express";

import application from "../controllers/application";

const apiRouter = Router();

apiRouter.get("/", (req, res) => res.send("biensupernice."));

/* ------ Application Routes ------ */
apiRouter.post("/application", application.create);
// apiRouter.get("/application/:id", application.read);
// apiRouter.put("/application", application.update);
// apiRouter.delete("/application", application.remove);

export { apiRouter };
