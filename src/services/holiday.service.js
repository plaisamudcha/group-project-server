import prisma from "../config/prisma.js";

const holidayService = {
  fetchHoliday: async () => {
    return await prisma.holiday.findMany();
  },
  createHoliday: async (data) => {
    return await prisma.holiday.create({ data });
  },
  checkInvalidLeaveDates: async (newStartDate, newEndDate) => {
    const start = new Date(newStartDate);
    const end = new Date(newEndDate);

    const startDay = start
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();
    const endDay = end
      .toLocaleDateString("en-US", { weekday: "long" })
      .toUpperCase();

    const [holiday, workPolicies] = await Promise.all([
      prisma.holiday.findFirst({
        where: {
          date: {
            gte: newStartDate,
            lte: newEndDate,
          },
        },
      }),
      prisma.workPolicy.findMany(),
    ]);

    // รวม working days จาก policy ทั้งหมด
    const allWorkingDays = new Set();
    for (const policy of workPolicies) {
      try {
        const workingDays = JSON.parse(policy.workingDays);
        workingDays.forEach((day) => allWorkingDays.add(day));
      } catch (err) {
        console.error("Error parsing workingDays", err);
      }
    }

    const isStartWorkingDay = allWorkingDays.has(startDay);
    const isEndWorkingDay = allWorkingDays.has(endDay);

    // ❌ ถ้าลาวันหยุดพิเศษ หรือวันลาไม่ตรงกับ working day เลย → ไม่ให้ลา
    const isInvalid = !!holiday || (!isStartWorkingDay && !isEndWorkingDay);

    return isInvalid;
  },

  patchHoliday: async (id, data) => {
    return await prisma.holiday.update({
      where: { id },
      data,
    });
  },
  fetchHolidayById: async (id) => {
    return await prisma.holiday.findMany({
      where: { id },
    });
  },
  deleteHoliday: async (id) => {
    return await prisma.holiday.delete({
      where: { id },
    });
  },
};

export default holidayService;
