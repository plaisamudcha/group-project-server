import prisma from "../config/prisma.js";
import createError from "../utils/create-error.util.js";

const attendanceService = {
  async clockIn(id) {
    // console.log(' Log id',  id)
    const today = new Date();
    today.setHours(0, 0, 0, 0); //set ให้เวลาเป็น0:0:0:0ใช้เปรียบเทียบข้อมูลในวันเดียวกัน
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1); //24ชั้วโมงของ today+1 เป็น25:00 ก็คือเป็นค่าของวันพรุ่งนี้ 00:00

    const existing = await prisma.attendance.findFirst({
      where: {
        userId: id,
        date: {
          gte: today, //gte: today (greater than or equal): วันที่ มากกว่าหรือเท่ากับ เวลา 00:00 ของวันนี้
          lt: tomorrow, //lt: tomorrow (less than): วันที่ น้อยกว่า เวลา 00:00 ของวันถัดไป
        },
      },
    });
    if (existing && existing.clockIn) {
      createError(400, "วันนี้คุณลงเวลาเข้างานไปแล้ว");
    }

    const profile = await prisma.employeeProfile.findFirst({
      where: { userId: id },
      include: {
        workPolicy: true,
        shift: true,
      },
    });

    console.log("profile", profile);
    if (!profile) {
      createError(400, "ไม่พบข้อมูลพนักงาน");
    }

    const now = new Date();
    const isLate = now > profile.workPolicy.startTime;
    const lateMinutes = isLate
      ? Math.floor((now - profile.workPolicy.startTime) / 1000 / 60)
      : 0;

    const attendance = await prisma.attendance.create({
      data: {
        userId: id,
        date: today,
        clockIn: now,
        isLate,
        lateMinutes,
        workPolicyId: profile.workPolicyId,
        shiftId: profile.shiftId || null,
      },
    });

    return attendance;
  },

  async clockOut(userId) {
    // 1. หาวันนี้ว่ามี clock-in หรือยัง
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(today.getDate() + 1);

    // หา record ที่ยังไม่มี clockOut
    const attendance = await prisma.attendance.findFirst({
      where: {
        userId: id,
        date: {
          gte: today,
          lt: tomorrow,
        },
        clockOut: null,
      },
    });

    if (!attendance) {
      throw createError(400, "ยังไม่ได้ clock-in หรือ clock-out ไปแล้ว");
    }

    const now = new Date();

    // คำนวณชั่วโมงทำงาน
    const totalHours = (now - attendance.clockIn) / 1000 / 60 / 60;

    // Update attendance
    const updated = await prisma.attendance.update({
      where: { id: attendance.id },
      data: {
        clockOut: now,
        totalHours,
        status: "COMPLETED",
      },
    });

    return updated;
  },

  async getAttendanceList(userId) {
    const attendances = await prisma.attendance.findMany({
      where: { userId },
      orderBy: { date: "desc" },
    });
    return attendances;
  },
  async getReports(userId) {
    // เริ่มต้นด้วย รายงานเฉพาะเดือนปัจจุบัน
    const now = new Date();
    const year = now.getFullYear();
    const month = now.getMonth(); // เดือนที่ 0 = มกราคม

    const firstDay = new Date(year, month, 1); // วันที่ 1 ของเดือนนี้
    const lastDay = new Date(year, month + 1, 1); // วันที่ 1 ของ "เดือนถัดไป"

    const attendances = await prisma.attendance.findMany({
      where: {
        userId,
        date: {
          gte: firstDay, // >= วันที่ 1 เดือนนี้ เวลา 00:00:00
          lt: lastDay, // < วันที่ 1 เดือนถัดไป เวลา 00:00:00
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
      totalDays, // รวมวันทั้งหมดที่มี record
      presentDays, // วันมาทำงานจริง
      lateDays, // จำนวนวันที่มาสาย
      totalHours, // ชั่วโมงรวมที่ทำงาน
      totalOT, // ชั่วโมง OT รวม
      attendances, // ข้อมูลดิบส่งกลับไปด้วยไว้ใช้ front-end
    };
  },
};

export default attendanceService;
