import leaveAdjustmentService from "../services/leave-adjustment.service.js";
import shiftService from "../services/shift.service.js";

const leaveAdjustmentController = {
  getAllLeaves: async (req, res) => {
    const leaves = await leaveAdjustmentService.getAllLeaves();
    res.json({ leaves });
  },
  createLeave: async (req, res) => {
    const { leaveRequestId, deductionMinutes, adjustmentType, attendanceId } =
      req.body;
    await leaveAdjustmentService.createLeave(
      leaveRequestId,
      deductionMinutes,
      adjustmentType,
      attendanceId
    );
    res.json({ message: "สร้างข้อมูลสำเร็จ" });
  },
  updateLeave: async (req, res) => {
    const { id } = req.params;
    const { leaveRequestId, deductionMinutes, adjustmentType, attendanceId } =
      req.body;
    await shiftService.updateShift(
      id,
      leaveRequestId,
      deductionMinutes,
      adjustmentType,
      attendanceId
    );
    res.json({ message: "แก้ไขข้อมูลสำเร็จ" });
  },
};

export default leaveAdjustmentController;
