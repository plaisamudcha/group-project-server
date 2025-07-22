import express from "express";

const attendanceRoute = express.Router();

attendanceRoute.post("/clock-in", () => {});
attendanceRoute.post("/clock-out", () => {});
attendanceRoute.get("/", () => {});
attendanceRoute.get("/reports", () => {});

export default attendanceRoute;
