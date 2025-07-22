import express from "express";
import authMiddleware from "../middlewares/auth.middleware";

const auditRoute = express.Router();

auditRoute.get("/", () => {});

export default auditRoute;
