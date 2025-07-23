import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import leaveController from "../controllers/leave.controller.js";

const leaveRoute = express.Router();
leaveRoute.use(authMiddleware.checkToken)
leaveRoute.post("/",leaveController.createLeavesRequests);
leaveRoute.get("/",authMiddleware.isRole('HR'),leaveController.getAllLeaves);
leaveRoute.get("/user", leaveController.getUserLeaves);
leaveRoute.get("/:id", leaveController.getLeavesDetails);
leaveRoute.put("/:id/status",authMiddleware.isRole('HR'),leaveController.updateLeaveStatus);

export default leaveRoute;
