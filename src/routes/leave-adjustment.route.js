import express from "express";
import shiftController from "../controllers/shift.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../validation/validate.validate.js";
import leaveAdjustmentSchema from "../validation/leaveAdjustment.validate.js";

const leaveAdjustmentRoute = express.Router();

leaveAdjustmentRoute.use(authMiddleware.checkToken);

leaveAdjustmentRoute.get("/", shiftController.getAllshift);
leaveAdjustmentRoute.post("/", validate(leaveAdjustmentSchema.createLeaveAdjustment), shiftController.createShift);
leaveAdjustmentRoute.put("/:id", validate(leaveAdjustmentSchema.UpdateLeaveAdjustment), shiftController.updateShift);

export default leaveAdjustmentRoute;
