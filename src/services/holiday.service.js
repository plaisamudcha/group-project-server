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

    // ดึงข้อมูล holidays และ work policies
    const [holidays, workPolicies] = await Promise.all([
      prisma.holiday.findMany({
        where: {
          date: {
            gte: newStartDate,
            lte: newEndDate,
          },
        },
      }),
      prisma.workPolicy.findMany(),
    ]);

    // Parse working days อย่างถูกต้อง
    const allWorkingDays = new Set();
    for (const policy of workPolicies) {
      try {
        console.log("Processing workPolicy:", policy.id);
        console.log("workingDays type:", typeof policy.workingDays);
        console.log("workingDays value:", policy.workingDays);
        
        let workingDays = [];
        
        // ถ้าเป็น JSON string ให้ parse
        if (typeof policy.workingDays === "string") {
          try {
            // ลอง parse เป็น JSON ก่อน
            workingDays = JSON.parse(policy.workingDays);
            console.log("Parsed as JSON:", workingDays);
          } catch (e) {
            // ถ้า parse ไม่ได้ ลอง split
            console.log("Failed to parse as JSON, trying split");
            workingDays = policy.workingDays.split(",").map((day) => day.trim());
          }
        } else if (Array.isArray(policy.workingDays)) {
          workingDays = policy.workingDays;
          console.log("Already an array:", workingDays);
        }

        // เพิ่มวันทำงานเข้า Set
        workingDays.forEach((day) => {
          allWorkingDays.add(day.toUpperCase().trim());
        });
        
      } catch (err) {
        console.error("Error parsing workingDays for policy", policy.id, err);
      }
    }

    console.log("All working days:", Array.from(allWorkingDays));
    console.log("Holidays in range:", holidays.map(h => h.date));

    // ตรวจสอบทุกวันในช่วงที่ลา
    let currentDate = new Date(start);
    while (currentDate <= end) {
      const dayName = currentDate
        .toLocaleDateString("en-US", { weekday: "long" })
        .toUpperCase();
      
      const dateStr = currentDate.toISOString().split('T')[0];
      
      // ตรวจว่าเป็นวันทำงานไหม
      if (!allWorkingDays.has(dayName)) {
        console.log(`${dateStr} (${dayName}) is not a working day - INVALID`);
        return true; // Invalid - ไม่ใช่วันทำงาน
      }
      
      // ตรวจว่าเป็นวันหยุดไหม
      const isHoliday = holidays.some(h => {
        const holidayDate = new Date(h.date);
        return holidayDate.toDateString() === currentDate.toDateString();
      });
      
      if (isHoliday) {
        console.log(`${dateStr} is a holiday - INVALID`);
        return true; // Invalid - เป็นวันหยุด
      }
      
      console.log(`${dateStr} (${dayName}) is valid`);
      currentDate.setDate(currentDate.getDate() + 1);
    }

    console.log("All dates are valid working days");
    return false; // Valid - ทุกวันเป็นวันทำงานและไม่ใช่วันหยุด
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