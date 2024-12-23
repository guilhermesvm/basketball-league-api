import express  from "express";
import { HealthController } from "../controllers/healthController";

const router = express.Router();
const healthController = new HealthController();

router.get("/healthcheck" , healthController.health);

export default router;