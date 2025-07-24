import express from "express";
import morgan from "morgan";
import cors from "cors";
import authRoute from "./routes/auth.route.js";
import userRoute from "./routes/user.route.js";
import profileRoute from "./routes/profile.route.js";
import attendanceRoute from "./routes/attendance.route.js";
import leaveRoute from "./routes/leave.route.js";
import workPolicyRoute from "./routes/work-policies.route.js";
import shiftsRoute from "./routes/shift.route.js";
import leaveAdjustmentRoute from "./routes/leave-adjustment.route.js";
import holidayRoute from "./routes/holiday.route.js";
import auditRoute from "./routes/audit-log.route.js";
import notFoundMiddleware from "./middlewares/not-found.middleware.js";
import errorMiddleware from "./middlewares/error.middleware.js";
import annualLeaveRoute from "./routes/annualLeave.route.js";

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/auth", authRoute);
app.use("/api/users", userRoute);
app.use("/api/profiles", profileRoute);
app.use("/api/attendance", attendanceRoute);
app.use("/api/leaves", leaveRoute);
app.use("/api/work-policies", workPolicyRoute);
app.use("/api/shifts", shiftsRoute);
app.use("/api/leave-adjustments", leaveAdjustmentRoute);
app.use("/api/holidays", holidayRoute);
app.use("/api/audit-logs", auditRoute);
app.use("/api/aunnual-leave", annualLeaveRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
