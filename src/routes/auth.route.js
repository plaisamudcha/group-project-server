import express from "express";
import authController from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../validation/validate.validate.js";
import authSchema from "../validation/authSchema.validate.js";

const authRoute = express.Router();

authRoute.post("/register", validate(authSchema.registerSchema), authController.register);
authRoute.post("/login", validate(authSchema.loginSchema), authController.login);
authRoute.post("/forgot-password", authController.forgotPassword);
authRoute.post("/reset-password/:token", validate(authSchema.forgotSchema), authController.resetPassword);
authRoute.post("/refresh-token", authController.refreshToken);
authRoute.get("/me", authMiddleware.checkToken, authController.getMe);

export default authRoute;
