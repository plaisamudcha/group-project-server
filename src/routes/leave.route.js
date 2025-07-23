import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import leaveController from "../controllers/leave.controller.js";

const leaveRoute = express.Router();
leaveRoute.use(authMiddleware.checkToken)
leaveRoute.post("/", () => {});
leaveRoute.get("/",authMiddleware.isRole('hr'),leaveController.getAllLeaves);
leaveRoute.get("/user", leaveController.getUserLeaves);
leaveRoute.get("/:id", leaveController.getLeavesDetails);
leaveRoute.put("/:id/status", () => {});

export default leaveRoute;
