import prisma from "../config/prisma.js";
import auditService from "../services/audit-log.service.js";
import profileService from "../services/profile.service.js";
import shiftService from "../services/shift.service.js";

const shiftController = {
  getAllshift: async (req, res) => {
    const result = await shiftService.getAllShiftsWithEmployees();
    res.json({ result });
  },
  createShift: async (req, res) => {
    const { name, inTime, outTime } = req.body;
    const result = await prisma.$transaction(async (tx) => {
      const newShift = await shiftService.createShift(
        {
          name,
          inTime,
          outTime,
        },
        tx
      );
      await auditService.createAuditLog(
        {
          action: "CREATE",
          relatedTable: "shift",
          relatedId: newShift.id,
          detail: `Created new shift: ${name}`,
          userId: req.user.id,
        },
        tx
      );
      return newShift;
    });
    res.json({ message: "สร้างข้อมูลสำเร็จ", result });
  },
  updateShift: async (req, res) => {
    const { id } = req.params;
    const { name, inTime, outTime } = req.body;
    const result = await prisma.$transaction(async (tx) => {
      const updatedShift = await shiftService.updateShift(
        Number(id),
        { name, inTime, outTime },
        tx
      );
      await auditService.createAuditLog(
        {
          action: "UPDATE",
          relatedTable: "shift",
          relatedId: updatedShift.id,
          detail: `Updated shift ID: ${updatedShift.id}`,
          userId: req.user.id,
        },
        tx
      );
      return updatedShift;
    });
    res.json({ message: "แก้ไขข้อมูลสำเร็จ", result });
  },

  // เพิ่ม: ฟังก์ชันสำหรับเพิ่มพนักงานเข้ากะ
  assignEmployee: async (req, res) => {
    const { shiftId, userId } = req.body;
    const result = await prisma.$transaction(async (tx) => {
      const updatedProfile = await profileService.assignShift(Number(userId), Number(shiftId), tx);
      await auditService.createAuditLog(
        {
          action: "UPDATE",
          relatedTable: "EmployeeProfile",
          relatedId: updatedProfile.id,
          detail: `Assigned shift ID ${shiftId} to user ID ${userId}`,
          userId: req.user.id,
        },
        tx
      );
      return updatedProfile;
    });
    res.json({ message: "เพิ่มพนักงานเข้ากะสำเร็จ", result });
  },

  // เพิ่ม: ฟังก์ชันสำหรับนำพนักงานออกจากกะ
  removeEmployee: async (req, res) => {
    const { userId } = req.body;
    const result = await prisma.$transaction(async (tx) => {
      const updatedProfile = await profileService.removeShift(Number(userId), tx);
      await auditService.createAuditLog(
        {
          action: "UPDATE",
          relatedTable: "EmployeeProfile",
          relatedId: updatedProfile.id,
          detail: `Removed shift from user ID ${userId}`,
          userId: req.user.id,
        },
        tx
      );
      return updatedProfile;
    });
    res.json({ message: "นำพนักงานออกจากกะสำเร็จ", result });
  },
};

export default shiftController;
