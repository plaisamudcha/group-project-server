import prisma from "../config/prisma.js";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";
import cron from "node-cron";

dayjs.extend(utc);
dayjs.extend(timezone);

/**
 * Cron Job นี้จะทำงานทุกวันตอน 23:59 น. เพื่อสรุปและสร้างบันทึกการเข้างาน
 * สำหรับพนักงานที่ยังไม่มีการบันทึกข้อมูลในวันนั้น (เช่น ไม่ได้ clock-in)
 * โดยจะกำหนดสถานะเป็น ABSENT (ขาดงาน) หรือ ON_LEAVE (ลา)
 */
const setupAttendanceFinalizerCron = () => {
  cron.schedule(
    "59 23 * * *", // ทำงานทุกวันตอน 23:59 น.
    async () => {
      const nowInBkk = dayjs().tz("Asia/Bangkok");
      console.log(
        `[CRON JOB] Starting: Finalize Daily Attendance at ${nowInBkk.format(
          "YYYY-MM-DD HH:mm:ss"
        )}`
      );

      try {
        const today = nowInBkk.format("YYYY-MM-DD");
        const dayOfWeek = nowInBkk.format("dddd").toUpperCase();

        // --- 1. ตรวจสอบก่อนว่าวันนี้เป็นวันหยุดหรือไม่ ---
        const holidayToday = await prisma.holiday.findFirst({
          where: { date: today },
        });

        if (holidayToday) {
          console.log(
            `[CRON JOB] Today is a holiday: ${holidayToday.name}. No records to finalize.`
          );
          return;
        }

        // --- 2. ดึงข้อมูลที่จำเป็นทั้งหมด ---
        const employees = await prisma.user.findMany({
          where: {
            role: { in: ["EMPLOYEE", "HR"] },
            employeeProfile: { isNot: null },
          },
          select: {
            id: true,
            employeeProfile: {
              select: {
                workPolicyId: true,
                shiftId: true,
                workPolicy: {
                  select: {
                    workingDays: true,
                  },
                },
              },
            },
          },
        });

        if (employees.length === 0) {
          console.log("[CRON JOB] No active employees found. Job finished.");
          return;
        }
        const employeeIds = employees.map((emp) => emp.id);

        // ดึงข้อมูลการเข้างานที่มีอยู่, และข้อมูลการลาของวันนี้
        const [existingAttendances, leavesToday] = await Promise.all([
          prisma.attendance.findMany({
            where: { userId: { in: employeeIds }, date: today },
            select: { userId: true },
          }),
          prisma.leaveRequest.findMany({
            where: {
              userId: { in: employeeIds },
              status: "APPROVED",
              startDate: { lte: today },
              endDate: { gte: today },
            },
            select: { userId: true },
          }),
        ]);

        const usersWithAttendance = new Set(
          existingAttendances.map((att) => att.userId)
        );
        const usersOnLeave = new Set(leavesToday.map((leave) => leave.userId));

        // --- 3. เตรียมข้อมูลสำหรับพนักงานที่ยังไม่มีบันทึกการเข้างาน ---
        const attendanceDataToCreate = [];

        for (const employee of employees) {
          // ข้าม: ถ้ามีบันทึกของวันนี้อยู่แล้ว (เช่น clock-in แล้ว)
          if (usersWithAttendance.has(employee.id)) {
            continue;
          }

          // ข้าม: ถ้าวันนี้ไม่ใช่วันทำงานของพนักงาน
          const workPolicy = employee.employeeProfile?.workPolicy;
          if (!workPolicy?.workingDays?.includes(dayOfWeek)) {
            continue;
          }

          // ตรวจสอบว่าเป็นวันลาหรือไม่
          const isOnLeave = usersOnLeave.has(employee.id);

          if (isOnLeave) {
            // ถ้าเป็นวันลา ให้สร้างบันทึกเป็น ON_LEAVE
            attendanceDataToCreate.push({
              userId: employee.id,
              date: today,
              isAbsent: false, // ไม่นับว่าขาดงาน
              status: "ON_LEAVE",
              workPolicyId: employee.employeeProfile.workPolicyId,
              shiftId: employee.employeeProfile.shiftId,
            });
          } else {
            // ถ้าไม่ใช่วันลา และไม่มีการ clock-in ให้สร้างบันทึกเป็น ABSENT
            attendanceDataToCreate.push({
              userId: employee.id,
              date: today,
              isAbsent: true, // ขาดงาน
              status: "ABSENT",
              workPolicyId: employee.employeeProfile.workPolicyId,
              shiftId: employee.employeeProfile.shiftId,
            });
          }
        }

        // --- 4. สร้างข้อมูลทั้งหมดในครั้งเดียว ---
        if (attendanceDataToCreate.length > 0) {
          const result = await prisma.attendance.createMany({
            data: attendanceDataToCreate,
          });
          console.log(
            `[CRON JOB] Successfully created ${result.count} final attendance records (ABSENT/ON_LEAVE).`
          );
        } else {
          console.log(
            "[CRON JOB] All employees have attendance records. No new records to create."
          );
        }
      } catch (error) {
        console.error("[CRON JOB] An error occurred during finalization:", error);
      } finally {
        console.log(
          `[CRON JOB] Finalization finished at ${dayjs()
            .tz("Asia/Bangkok")
            .format("YYYY-MM-DD HH:mm:ss")}`
        );
      }
    },
    {
      timezone: "Asia/Bangkok",
    }
  );

  console.log("✅ Cron Job for attendance finalization has been scheduled.");
};

export default setupAttendanceFinalizerCron;
