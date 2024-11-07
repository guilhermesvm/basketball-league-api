import { UserController } from "../controllers/userController";
import express  from "express";

const router = express.Router();
const userController = new UserController();

router.get("/users", userController.getAll)
router.get("/users/:id", userController.getById);
router.post("/users", userController.create);
router.put("/users/:id", userController.update);
router.delete("/users/:id", userController.delete)

export default router;