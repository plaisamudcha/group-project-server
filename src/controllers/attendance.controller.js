import attendanceService from "../services/attendance.service.js";
const attendanceController = {
  // ---- Clock In ----
  clockIn: async (req, res) => {
    const userId = req.user.id;
    // console.log('Log userId', userId)
    const attendance = await attendanceService.clockIn(userId);

    if (!attendance) {
      createError(400, "Clock-in ไม่สำเร็จ");
    }

    res.json({ message: "Clock-in สำเร็จ", attendance });
  },

  // ---- Clock Out ----
  clockOut: async (req, res) => {
    const userId = req.user.id;
    const attendance = await attendanceService.clockOut(userId);

    if (!attendance) {
      throw createError(400, "Clock-out ไม่สำเร็จ");
    }

    res.json({ message: "Clock-out สำเร็จ", attendance });
  },

  // ---- Get Attendance List ----
  getAttendanceList: async (req, res) => {
    const userId = req.user.id; // หรือ req.user.userId แล้วแต่ payload JWT
    const attendances = await attendanceService.getAttendanceList(userId);
    res.json({ attendances });
  },

  // ---- Get Attendance Reports ----
  getReports: async (req, res) => {
    const userId = req.user.id;
    const reports = await attendanceService.getReports(userId);

    res.json({ reports });
  },
};

export default attendanceController;

