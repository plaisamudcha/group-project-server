import express from "express";

const leaveRoute = express.Router();

leaveRoute.post("/", () => {});
leaveRoute.get("/", () => {});
leaveRoute.get("/:id", () => {});
leaveRoute.put("/:id/status", () => {});

export default leaveRoute;
