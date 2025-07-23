import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import userController from "../controllers/user.controller.js";

const profileRoute = express.Router();

profileRoute.get("/:userId", authMiddleware.checkToken, userController.getProfileByUserId);
profileRoute.put("/:userId", authMiddleware.checkToken, authMiddleware.isRole(["HR"]), userController.updateProfileByUserId);

export default profileRoute;
