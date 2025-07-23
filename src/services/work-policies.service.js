import prisma from "../config/prisma.js";

const workPolicyService = {
  getAllPolicies: async () => {
    return await prisma.workPolicy.findMany();
  },
  createPolicy: async (
    name,
    start,
    end,
    allowMin,
    deduct,
    minHourHalfDay,
    halfDay,
    remark = ""
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
      },
    });
  },
  UpdatePolicy: async (
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
  },
};

export default workPolicyService;
