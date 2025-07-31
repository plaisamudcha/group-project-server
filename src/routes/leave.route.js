import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import leaveController from "../controllers/leave.controller.js";
import validate from "../validation/validate.validate.js";
import leaveSchema from "../validation/leave.validate.js";

const leaveRoute = express.Router();
leaveRoute.use(authMiddleware.checkToken)
leaveRoute.post("/", validate(leaveSchema.createLeaveRequest), leaveController.createLeavesRequests);
leaveRoute.get("/",authMiddleware.isRole('HR'),leaveController.getAllLeaves);
leaveRoute.get("/user", leaveController.getUserLeaves);
leaveRoute.get("/:id", leaveController.getLeavesDetails);
leaveRoute.put("/:id/status", validate(leaveSchema.UpdateLeaveRequest), authMiddleware.isRole('HR'),leaveController.updateLeaveStatus);

export default leaveRoute;
