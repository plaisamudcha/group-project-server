import app from "./app.js";
import dotenv from "dotenv";
import shutdown from "./utils/shutdown.util.js";
import runAttendanceCron from "./node-cron/attendance.node-cron.js";

dotenv.config();
const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  runAttendanceCron();
  console.log(`Server is running on http://localhost:${PORT}`);
});

process.on("SIGINT", () => shutdown("SIGINT"));
process.on("SIGTERM", () => shutdown("SIGTERM"));

process.on("uncaughtException", () => shutdown("uncaughtException"));
process.on("unhandledRejection", () => shutdown("unhandledRejection"));
