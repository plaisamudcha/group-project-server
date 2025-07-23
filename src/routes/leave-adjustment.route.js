import express from "express";
import shiftController from "../controllers/shift.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const leaveAdjustmentRoute = express.Router();

leaveAdjustmentRoute.use(authMiddleware.checkToken);

leaveAdjustmentRoute.get("/", shiftController.getAllshift);
leaveAdjustmentRoute.post("/", shiftController.createShift);
leaveAdjustmentRoute.put("/:id", shiftController.updateShift);

export default leaveAdjustmentRoute;
