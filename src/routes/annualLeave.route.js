import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import annualLeaveController from "../controllers/annualLeave.controller.js";
import validate from "../validation/validate.validate.js";
import leaveAnnualSchema from "../validation/annualLeave.validate.js";

const annualLeaveRoute = express.Router();
annualLeaveRoute.use(authMiddleware.checkToken);

annualLeaveRoute.get(
  "/",
  authMiddleware.isRole("HR"),
  annualLeaveController.getAllEntitlements
);
annualLeaveRoute.get("/user", annualLeaveController.getUserEntitlements);
annualLeaveRoute.post("/", authMiddleware.isRole("HR"), validate(leaveAnnualSchema.createLeaveAnnual), annualLeaveController.createEntitlement);
annualLeaveRoute.put(
  "/:id",
  authMiddleware.isRole("HR"),
  validate(leaveAnnualSchema.UpdateLeaveAnnual),
  annualLeaveController.updateEntitlement
);
annualLeaveRoute.post("/create", authMiddleware.isRole("HR"),annualLeaveController.createOrUpdateUserEntitlements);
annualLeaveRoute.put("/create", authMiddleware.isRole("HR"),annualLeaveController.createOrUpdateUserEntitlements);
annualLeaveRoute.post("/createbulk", authMiddleware.isRole("HR"),annualLeaveController.createBulkEntitlements);
annualLeaveRoute.delete("/user/:userId/year/:year", authMiddleware.isRole("HR"),annualLeaveController.deleteUserEntitlements);

export default annualLeaveRoute;
