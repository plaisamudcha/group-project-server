import prisma from "../config/prisma.js";

const workPolicyService = {
  getAllPolicies: async () => {
    return await prisma.workPolicy.findMany();
  },
  getPolicyById: async (id) => {
    return await prisma.workPolicy.findUnique({ where: { id } });
  },
  createPolicy: async (
    name,
    start,
    end,
    allowMin,
    deduct,
    minHourHalfDay,
    halfDay,
    remark = "",
    workingDays
  ) => {
    return await prisma.workPolicy.create({
      data: {
        name,
        startTime: start,
        endTime: end,
        allowedLateMinutesPerMonth: allowMin,
        deductIfLateOver: deduct,
        minHoursForHalfDay: minHourHalfDay,
        halfDayAbsentRule: halfDay,
        remark,
        workingDays
      },
    });
  },
  updatePolicy: async (
    id,
    name,
    start,
    end,
    allowMin,
    deduct,
    minHourHalfDay,
    halfDay,
    remark = ""
  ) => {
    return await prisma.workPolicy.update({
      where: { id },
      data: {
        name,
        startTime: start,
        endTime: end,
        allowedLateMinutesPerMonth: allowMin,
        deductIfLateOver: deduct,
        minHoursForHalfDay: minHourHalfDay,
        halfDayAbsentRule: halfDay,
        remark,
      },
    });
  }, assignPolicyToEmployees: async (policyId, employeeIds, tx = prisma) => {
    return await tx.employeeProfile.updateMany({
      where: {
        userId: {
          in: employeeIds, // อัปเดตโปรไฟล์ทั้งหมดที่มี userId อยู่ใน Array นี้
        },
      },
      data: {
        workPolicyId: policyId, // ตั้งค่า workPolicyId ใหม่
      },
    });
  },
};

export default workPolicyService;
