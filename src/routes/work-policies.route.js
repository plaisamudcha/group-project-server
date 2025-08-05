import express from "express";
import workPolicyController from "../controllers/work-policies.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import validate from "../validation/validate.validate.js";
import workPolicySchema from "../validation/workPolicy.validate.js";

const workPolicyRoute = express.Router();

workPolicyRoute.use(authMiddleware.checkToken);
workPolicyRoute.use(authMiddleware.isRole("HR"));

workPolicyRoute.get("/", workPolicyController.getAllPolicies);
workPolicyRoute.post(
  "/",
  validate(workPolicySchema.createWorkPolicy),
  workPolicyController.createPolicy
);
workPolicyRoute.put(
  "/:id",
  validate(workPolicySchema.updateWorkPolicy),
  workPolicyController.updatePolicy
);
workPolicyRoute.post("/assign", workPolicyController.assignPolicy);
export default workPolicyRoute;
