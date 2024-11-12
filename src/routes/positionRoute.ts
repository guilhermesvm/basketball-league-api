import express from "express";
import PositionController from "../controllers/positionController";
import authentication from "../middlewares/authenticationHandler";

const router = express.Router()
const positionController = new PositionController;

router.get("/positions", authentication.hasAuthentication, positionController.getAll);
router.get("/positions/:id", authentication.hasAuthentication, positionController.getById);

export default router;