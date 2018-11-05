import { Router } from "express";

import auth from "../controllers/auth";
import user from "../controllers/user";
import application from "../controllers/application";

import authMiddleware from "../middleware/auth";
import authAdminMiddleware from "../middleware/authAdmin";

const apiRouter = Router();

/* ------ Auth Route ------ */
apiRouter.post("/auth", auth.create);

/* ------ User Routes ------ */
apiRouter.post("/user", user.create);
apiRouter.get("/user/:id", authMiddleware, user.read);
apiRouter.put("/user", user.update);
apiRouter.delete("/user/:id", authAdminMiddleware, user.remove);

/* ------ Application Routes ------ */
apiRouter.post("/application", application.create);
apiRouter.get("/application/:id", application.read);
apiRouter.put("/application", application.update);
apiRouter.delete("/application", application.remove);

export { apiRouter };
