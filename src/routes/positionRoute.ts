import express from "express";
import PositionController from "../controllers/positionController";

const router = express.Router()
const positionController = new PositionController;

router.get("/positions", positionController.getAll);
router.get("/positions/:id", positionController.getById)

export default router;