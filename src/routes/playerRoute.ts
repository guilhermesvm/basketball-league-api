import express  from "express";
import { PlayerController } from "../controllers/playerController";
import PlayerEntity from "../entities/Player";
import { validationMiddleware } from "../middlewares/fieldValidation";
import authentication from "../middlewares/authenticationHandler";

const router = express.Router();
const playerController = new PlayerController();

router.get("/players", authentication.hasAuthentication, playerController.getAll);
router.get("/players/:id", authentication.hasAuthentication, playerController.getById);
router.post("/players", authentication.hasAuthentication, validationMiddleware(PlayerEntity), playerController.create);
router.post("/players/:id/positions", authentication.hasAuthentication, playerController.insertPosition);
router.put("/players/:id", authentication.hasAuthentication, validationMiddleware(PlayerEntity), playerController.update);
router.delete("/players/:id", authentication.hasAuthentication, playerController.delete);
router.delete("/players/:id/positions/:positionId", authentication.hasAuthentication, playerController.removePositionFromPlayer);

export default router;