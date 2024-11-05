import express from "express";
import { TeamController } from "../controllers/teamController";
import { validationMiddleware } from "../middlewares/fieldValidation";
import TeamEntity from "../entities/Team";

const router = express.Router();
const teamController = new TeamController();

router.get("/teams", teamController.getAll);
router.get("/teams/:id", teamController.getById);
router.post("/teams", validationMiddleware(TeamEntity), teamController.create);
router.put("/teams/:id", validationMiddleware(TeamEntity), teamController.update);
router.delete("/teams/:id", teamController.delete);

export default router;
