import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import userController from "../controllers/user.controller.js";

const userRoute = express.Router();

userRoute.use(authMiddleware.checkToken);

userRoute.get("/", authMiddleware.isRole(["HR"]), userController.getAllUsers);
userRoute.get("/:id", userController.getUserById);
userRoute.post("/", authMiddleware.isRole(["HR"]), userController.createUser);
userRoute.put("/:id", authMiddleware.isRole(["HR"]), userController.updateUser);

export default userRoute;
