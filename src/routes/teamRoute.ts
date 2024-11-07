import express from "express";
import { TeamController } from "../controllers/teamController";
import { validationMiddleware } from "../middlewares/fieldValidation";
import TeamEntity from "../entities/Team";
import authentication from "../middlewares/authenticationHandler";

const router = express.Router();
const teamController = new TeamController();

router.get("/teams", authentication.hasAuthentication, teamController.getAll);
router.get("/teams/:id", authentication.hasAuthentication, teamController.getById);
router.post("/teams", authentication.hasAuthentication, validationMiddleware(TeamEntity), teamController.create);
router.put("/teams/:id", authentication.hasAuthentication, validationMiddleware(TeamEntity), teamController.update);
router.delete("/teams/:id", authentication.hasAuthentication, teamController.delete);

export default router;
