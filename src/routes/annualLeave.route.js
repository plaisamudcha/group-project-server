import express from "express";

const annualLeaveRoute = express.Router();

annualLeaveRoute.get("/", () => {});
annualLeaveRoute.get("/:userId", () => {});
annualLeaveRoute.post("/", () => {});
annualLeaveRoute.patch("/:id", () => {});

export default annualLeaveRoute;
