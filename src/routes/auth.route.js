import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const authRoute = express.Router();

authRoute.post("/register", authController.register);
authRoute.post("/login", authController.login);
authRoute.post("/forgot-password", authController.forgotPassword);
authRoute.post("/reset-password/:token", authController.resetPassword);
authRoute.post("/refresh-token", authController.refreshToken);
authRoute.get("/me", authMiddleware.checkToken, authController.getMe);

export default authRoute;
