import express from "express";
import auditController from "../controllers/audit-log.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const auditRoute = express.Router();

auditRoute.use(authMiddleware.checkToken)

auditRoute.get("/", authMiddleware.isRole('HR'), auditController.getAuditLog);

export default auditRoute;
