import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";

const auditRoute = express.Router();

auditRoute.get("/", () => {});

export default auditRoute;
