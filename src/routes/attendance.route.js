import express from "express";
import authMiddleware from '../middlewares/auth.middleware.js';
import attendanceController from "../controllers/attendance.controller.js";
import { validate } from "node-cron";
import attendanceSchema from "../validation/attendance.validate.js";
const attendanceRoute = express.Router();
attendanceRoute.use(authMiddleware.checkToken)
attendanceRoute.post("/clock-in", attendanceController.clockIn);
attendanceRoute.post("/clock-out", attendanceController.clockOut);
attendanceRoute.get("/", attendanceController.getAttendanceList);
attendanceRoute.get("/all", authMiddleware.isRole('HR'), attendanceController.getAllAttendances);
attendanceRoute.get("/reports", authMiddleware.checkToken, attendanceController.getReports);

export default attendanceRoute;