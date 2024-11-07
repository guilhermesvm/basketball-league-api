import express from "express";
import { AuthController } from "../controllers/authController";

const router = express.Router();
const authController = new AuthController();

router.post("/auth", authController.login)

export default router;

