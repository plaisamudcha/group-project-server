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
  validate(workPolicySchema.createOrUpdateWorkPolicy),
  workPolicyController.createPolicy
);
workPolicyRoute.put(
  "/:id",
  validate(workPolicySchema.UpdateWorkPolicy),
  workPolicyController.updatePolicy
);

export default workPolicyRoute;
