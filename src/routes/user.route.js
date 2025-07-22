import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import userController from "../controllers/user.controller.js";

const userRoute = express.Router();

userRoute.get("/", authMiddleware.checkToken,authMiddleware.isRole(["HR"]), userController.getAllUsers);
userRoute.get("/:id", authMiddleware.checkToken, userController.getUserById);
userRoute.post("/", authMiddleware.checkToken, authMiddleware.isRole(["HR"]), userController.createUser);
userRoute.put("/:id", authMiddleware.checkToken, authMiddleware.isRole(["HR"]), userController.updateUser );

export default userRoute;
