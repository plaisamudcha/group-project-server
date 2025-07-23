import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import profileController from "../controllers/profile.controller.js";

const profileRoute = express.Router();

profileRoute.use(authMiddleware.checkToken);

profileRoute.get("/:userId", profileController.getProfileByUserId);
profileRoute.put("/:userId", authMiddleware.isRole(["HR"]), profileController.updateProfileByUserId);

export default profileRoute;
