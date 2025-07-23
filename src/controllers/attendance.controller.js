import attendanceService from "../services/attendance.service.js";
const attendanceController = {

  clockIn: (req, res) => {
    res.json({ message: "clock in" });
  },

  clockOut: (req, res) => {
    res.json({ message: "clock out" });
  },

  getAttendanceList: (req, res) => {
    res.json({ message: "get attendance list" });
  },

  getReports: (req, res) => {
    res.json({ message: "get reports" });
  },
};

export default attendanceController;

