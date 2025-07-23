// import express from "express";

// const attendanceRoute = express.Router();

// attendanceRoute.post("/clock-in", () => {});
// attendanceRoute.post("/clock-out", () => {});
// attendanceRoute.get("/", () => {});
// attendanceRoute.get("/reports", () => {});

// export default attendanceRoute;
//*************************************************** */

import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js"
import attendanceController from "../controllers/attendance.controller.js";

const attendanceRoute = express.Router();

attendanceRoute.post("/clock-in", authMiddleware, attendanceController.clockIn);
attendanceRoute.post("/clock-out", authMiddleware, attendanceController.clockOut);
attendanceRoute.get("/", authMiddleware, attendanceController.getAttendanceList);
attendanceRoute.get("/reports", authMiddleware, attendanceController.getReports);

export default attendanceRoute;
