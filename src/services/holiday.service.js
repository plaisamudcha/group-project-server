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
        // Debug: ดูว่า workingDays เป็นอะไร
        console.log("workingDays value:", policy.workingDays);
        console.log("workingDays type:", typeof policy.workingDays);
        console.log("Is array:", Array.isArray(policy.workingDays));

        let workingDays = [];

        // เช็คประเภทข้อมูลก่อน
        if (typeof policy.workingDays === "string") {
          workingDays = policy.workingDays.split(",").map((day) => day.trim());
        } else if (Array.isArray(policy.workingDays)) {
          workingDays = policy.workingDays;
        } else if (policy.workingDays) {
          // ถ้าเป็น object หรืออย่างอื่น ให้ลอง stringify แล้ว parse
          console.log("Unknown type, trying to convert:", policy.workingDays);
          workingDays = Object.values(policy.workingDays).flat();
        }

        workingDays.forEach((day) => allWorkingDays.add(day));
      } catch (err) {
        console.error("Error parsing workingDays", err);
        console.error("Policy:", policy);
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
