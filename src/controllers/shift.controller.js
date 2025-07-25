import prisma from "../config/prisma.js";
import shiftService from "../services/shift.service.js";

const shiftController = {
  getAllshift: async (req, res) => {
    const result = await shiftService.getAllShifts();
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
      await auditLogService.createAuditLog(
        {
          action: "CREATE",
          entity: "shift",
          entityId: newShift.id,
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
      await auditLogService.createAuditLog(
        {
          action: "UPDATE",
          entity: "shift",
          entityId: updatedShift.id,
          userId: req.user.id,
        },
        tx
      );
      return updatedShift;
    });
    res.json({ message: "แก้ไขข้อมูลสำเร็จ", result });
  },
};

export default shiftController;
