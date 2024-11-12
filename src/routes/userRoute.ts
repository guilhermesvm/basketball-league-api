import express  from "express";
import { UserController } from "../controllers/userController";
import authentication from "../middlewares/authenticationHandler";

const router = express.Router();
const userController = new UserController();

router.get("/users", authentication.hasAuthentication, userController.getAll);
router.get("/users/:id", authentication.hasAuthentication, userController.getById);
router.post("/users", authentication.hasAuthentication, userController.create);
router.put("/users/:id", authentication.hasAuthentication, userController.update);
router.delete("/users/:id", authentication.hasAuthentication, userController.delete);

export default router;