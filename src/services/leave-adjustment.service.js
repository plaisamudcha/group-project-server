import prisma from "../config/prisma.js";

const leaveAdjustmentService = {
  getAllLeaves: async () => {
    return await prisma.leaveAdjustment.findMany();
  },
  createLeave: async (requestId, deduction, adjustType, attendId) => {
    return await prisma.leaveAdjustment.create({
      data: {
        leaveRequestId: requestId,
        deductionMinutes: deduction,
        adjustmentType: adjustType,
        attendanceId: attendId,
      },
    });
  },
  updateLeave: async (id, requestId, deduction, adjustType, attendanceId) => {
    return await prisma.leaveAdjustment.update({
      where: { id },
      data: {
        leaveRequestId: requestId,
        deductionMinutes: deduction,
        adjustmentType: adjustType,
        attendanceId: attendId,
      },
    });
  },
};

export default leaveAdjustmentService;
