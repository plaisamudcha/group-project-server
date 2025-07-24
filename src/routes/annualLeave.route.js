import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import annualLeaveController from "../controllers/annualLeave.controller.js";

const annualLeaveRoute = express.Router();
annualLeaveRoute.use(authMiddleware.checkToken);
annualLeaveRoute.get(
  "/",
  authMiddleware.isRole("HR"),
  annualLeaveController.getAllEntitlements
);
annualLeaveRoute.get("/user", annualLeaveController.getUserEntitlements);
annualLeaveRoute.post("/", authMiddleware.isRole("HR"),annualLeaveController.createEntitlement);
annualLeaveRoute.patch(
  "/:id",
  authMiddleware.isRole("HR"),
  annualLeaveController.updateEntitlement
);

export default annualLeaveRoute;
