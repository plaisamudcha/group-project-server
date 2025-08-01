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
 * รองรับการลาครึ่งวัน: ถ้าลาครึ่งวันแต่ไม่เข้างานเลย จะถือว่าขาดงาน
 */
const setupAttendanceFinalizerCron = () => {
  cron.schedule(
    "59 23 * * *",
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

        const holidayToday = await prisma.holiday.findFirst({
          where: { date: today },
        });

        if (holidayToday) {
          console.log(
            `[CRON JOB] Today is a holiday: ${holidayToday.name}. No records to finalize.`
          );
          return;
        }

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

        const [existingAttendances, leavesToday] = await Promise.all([
          prisma.attendance.findMany({
            where: { userId: { in: employeeIds }, date: today },
            select: { userId: true },
          }),
          prisma.leaveRequest.findMany({
            where: {
              userId: { in: employeeIds },
              status: "APPROVED",
              // ✅ แก้ไข: ใช้ toDate() เพื่อให้ Prisma เปรียบเทียบ DateTime ได้ถูกต้อง
              startDate: { lte: nowInBkk.toDate() },
              endDate: { gte: nowInBkk.toDate() },
            },
            select: { userId: true, leaveSession: true },
          }),
        ]);

        const usersWithAttendance = new Set(
          existingAttendances.map((att) => att.userId)
        );

        const userLeaveSessions = new Map(
          leavesToday.map((leave) => [leave.userId, leave.leaveSession])
        );

        const attendanceDataToCreate = [];

        for (const employee of employees) {
          if (usersWithAttendance.has(employee.id)) {
            continue;
          }

          const workPolicy = employee.employeeProfile?.workPolicy;
          if (!workPolicy?.workingDays?.includes(dayOfWeek)) {
            continue;
          }
            
          const leaveSession = userLeaveSessions.get(employee.id);

          // ถ้าเป็นการลาเต็มวัน (FULL_DAY) เท่านั้น ถึงจะบันทึกเป็น ON_LEAVE
          if (leaveSession === "FULL_DAY") {
            attendanceDataToCreate.push({
              userId: employee.id,
              date: today,
              isAbsent: false,
              status: "ON_LEAVE",
              workPolicyId: employee.employeeProfile.workPolicyId,
              shiftId: employee.employeeProfile.shiftId,
            });
          } else {
            // ถ้าไม่ลา, หรือลาแค่ครึ่งวัน (HALF_DAY_MORNING/AFTERNOON) แต่ไม่ clock-in เลยทั้งวัน => ถือว่าขาดงาน (ABSENT)
            attendanceDataToCreate.push({
              userId: employee.id,
              date: today,
              isAbsent: true,
              status: "ABSENT",
              workPolicyId: employee.employeeProfile.workPolicyId,
              shiftId: employee.employeeProfile.shiftId,
            });
          }
        }

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
