import express from "express";
import workPolicyController from "../controllers/work-policies.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const workPolicyRoute = express.Router();

workPolicyRoute.use(authMiddleware.checkToken);
workPolicyRoute.use(authMiddleware.isRole("HR"));

workPolicyRoute.get("/", workPolicyController.getAllPolicies);
workPolicyRoute.post("/", workPolicyController.createPolicy);
workPolicyRoute.put("/:id", workPolicyController.updatePolicy);

export default workPolicyRoute;
