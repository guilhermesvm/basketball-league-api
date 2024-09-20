import express  from "express";
import { PlayerController } from "../controllers/playerController";
import PlayerEntity from "../entities/Player";
import { validationMiddleware } from "../middleware/fieldValidation";

const router = express.Router();
const playerController = new PlayerController();

router.get("/players", playerController.getAll);
router.get("/players/:id", playerController.getById);
router.post("/players", validationMiddleware(PlayerEntity), playerController.create);
router.put("/players/:id", validationMiddleware(PlayerEntity), playerController.update);
router.delete("/players/:id", playerController.delete);

export default router;