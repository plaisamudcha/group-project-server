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

const app = express();
app.use(express.json());
app.use(morgan("dev"));
app.use(cors());

app.use("/auth", authRoute);
app.use("/users", userRoute);
app.use("/profiles", profileRoute);
app.use("/attendance", attendanceRoute);
app.use("/leaves", leaveRoute);
app.use("/work-policies", workPolicyRoute);
app.use("/shifts", shiftsRoute);
app.use("/leave-adjustments", leaveAdjustmentRoute);
app.use("/holidays", holidayRoute);
app.use("/audit-logs", auditRoute);

app.use(notFoundMiddleware);
app.use(errorMiddleware);

export default app;
