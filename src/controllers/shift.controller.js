import shiftService from "../services/shift.service.js";

const shiftController = {
  getAllshift: async (req, res) => {
    const shifts = await shiftService.getAllShifts();
    res.json({ shifts });
  },
  createShift: async (req, res) => {
    const { name, inTime, outTime } = req.body;
    await shiftService.createShift(name, inTime, outTime);
    res.json({ message: "สร้างข้อมูลสำเร็จ" });
  },
  updateShift: async (req, res) => {
    const { id } = req.params;
    const { name, inTime, outTime } = req.body;
    await shiftService.updateShift(id, name, inTime, outTime);
    res.json({ message: "แก้ไขข้อมูลสำเร็จ" });
  },
};

export default shiftController;
