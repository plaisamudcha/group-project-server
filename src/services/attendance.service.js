import prisma from "../config/prisma.js";
import createError from "../utils/create-error.util.js";
import dayjs from "dayjs";


const attendanceService = {
  async clockIn(id) {
    const userId = Number(id);
    const today = dayjs().format("YYYY-MM-DD");
    const existing = await prisma.attendance.findFirst({
      where: {
        userId: userId,
        date: today,
      }
    });
    if (existing && existing.clockIn) {
      createError(400, "วันนี้มีการ clock-in แล้ว");
    }



    const profile = await prisma.employeeProfile.findFirst({
      where: { userId },
      include: {
        workPolicy: true,
        shift: true,
      },
    });

    if (!profile) {
      createError(400, "ไม่พบข้อมูลพนักงาน");
    }

    const now = dayjs();
    const startTimeStr = profile.shift
      ? profile.shift.inTime
      : profile.workPolicy.startTime;

    const startTimeObj = dayjs(`${today} ${startTimeStr}`, "YYYY-MM-DD HH:mm");

    const isLate = now.isAfter(startTimeObj);
    const lateMinutes = Math.max(0, now.diff(startTimeObj, "minute"));

    const attendance = await prisma.attendance.create({
      data: {
        userId,
        date: today,
        clockIn: now.format("HH:mm"),
        isLate,
        lateMinutes,
        workPolicyId: profile.workPolicyId,
        shiftId: profile?.shiftId || null,
      },
    });

    return attendance;
  },

  async clockOut(userId) {
    // 1. หาวันนี้ว่ามี clock-in หรือยัง
    const today = dayjs().format("YYYY-MM-DD");
    const now = dayjs();
    const nowString = now.format("HH:mm");               // "15:40"


    // ถ้าไม่มี clock-in ให้แจ้งว่าไม่สามารถ clock-out ได้
    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: Number(userId),
        date: today,
        clockIn: {
          not: null, // ต้องมีการ clock-in ก่อน
        },
      },
    });
    if (!attendance) {
      createError(400, "ยังไม่มีการ clock-in วันนี้ หรือ clock-out ไปแล้ว");
    }


    // คำนวณชั่วโมงทำงาน

    const dateString = attendance.date;     // "2025-07-25"
    const clockInString = attendance.clockIn; // "09:00"

    const clockInTime = dayjs(`${dateString} ${clockInString}`, "YYYY-MM-DD HH:mm");
    // ตอน clock-out ให้สร้าง now เช่น


    const totalHours = parseFloat(now.diff(clockInTime, "hour", true).toFixed(2)); // ชั่วโมงที่ทำงาน เช่น 8.50
    // นำ workPolicyId และ shiftId มาจาก attendance เพื่อคำนวนหา overtime
    const profile = await prisma.employeeProfile.findFirst({
      where: { userId: Number(userId) },
      include: {
        workPolicy: true,
        shift: true,
      },

    });

    if (!profile) {
      createError(400, "ไม่พบข้อมูลพนักงาน");
    }


    let policyStart, policyEnd;
    if (profile.shift) {
      policyStart = dayjs(`${today} ${profile.shift.inTime}`, "YYYY-MM-DD HH:mm");
      policyEnd = dayjs(`${today} ${profile.shift.outTime}`, "YYYY-MM-DD HH:mm");
    } else {
      policyStart = dayjs(`${today} ${profile.workPolicy.startTime}`, "YYYY-MM-DD HH:mm");
      policyEnd = dayjs(`${today} ${profile.workPolicy.endTime}`, "YYYY-MM-DD HH:mm");
    }

    const totalTimePolicy = policyEnd.diff(policyStart, "hour", true);

    const overtimeHours = totalHours - totalTimePolicy; // ชั่วโมง OT ถ้าเป็นลบลบจะเป็นค่าลบ
    const overtime = overtimeHours > 0 ? overtimeHours : 0; // ถ้า overtime เป็นลบ ให้เป็น 0



    // Update attendance
    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        clockOut: now.format("HH:mm"),
        totalHours,
        status: "COMPLETED",
        overtimeHours: overtime,
        isAbsent: false, // ถ้า clock-out สำเร็จ แสดงว่าไม่ขาดงาน
      },

    });

    return updated;
  },
  async getAttendanceList(userId) {
    const attendances = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    return attendances;
  },
  async getReports(userId) {
    // กำหนดช่วงเดือนปัจจุบันด้วย dayjs
    const now = dayjs();
    const firstDay = now.startOf("month").format("YYYY-MM-DD"); // เช่น "2025-07-01"
    const lastDay = now.endOf("month").format("YYYY-MM-DD");   // เช่น "2025-07-31"

    const attendances = await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: firstDay, // >= "2025-07-01"
          lte: lastDay,  // <= "2025-07-31"
        },
      },
    });

    // สรุปข้อมูล
    const totalDays = attendances.length;
    const presentDays = attendances.filter(
      (a) => !a.isAbsent && a.clockIn
    ).length;
    const lateDays = attendances.filter((a) => a.isLate).length;
    const totalHours = attendances.reduce(
      (sum, a) => sum + (a.totalHours || 0),
      0
    );
    const totalOT = attendances.reduce(
      (sum, a) => sum + (a.overtimeHours || 0),
      0
    );

    return {
      totalDays,
      presentDays,
      lateDays,
      totalHours,
      totalOT,
      attendances,
    };
  }
};

export default attendanceService;
