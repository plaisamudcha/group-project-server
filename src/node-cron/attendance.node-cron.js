import prisma from "../config/prisma.js";
import dayjs from "dayjs";
import cron from "node-cron";

const runAttendanceCron = () => {
  cron.schedule("0 2 * * *", async () => {
    console.log(
      `Running attendance cron job at ${dayjs().format("YYYY-MM-DD HH:mm:ss")}`
    );
    const today = dayjs().format("YYYY-MM-DD");
    const users = await prisma.user.findMany({
      where: {
        role: "EMPLOYEE",
        employeeProfile: {
          NOT: null,
        },
      },
      include: {
        employeeProfile: {
          include: {
            workPolicy: true,
            shift: true,
          },
        },
      },
    });

    for (const user of users) {
      const { id, employeeProfile } = user;
      const { workPolicy, shift } = employeeProfile;
      const existing = await prisma.attendance.findFirst({
        where: {
          userId: id,
          date: today,
        },
      });
      if (existing) continue;

      const leaveToday = await prisma.leaveRequest.findFirst({
        where: {
          userId: id,
          status: "APPROVED",
          startDate: {
            lte: today,
          },
          endDate: {
            gte: today,
          },
        },
      });

      const isAbsent = !leaveToday;

      await prisma.attendance.create({
        data: {
          userId: id,
          date: today,
          clockIn: null,
          clockOut: null,
          isLate: false,
          isAbsent: isAbsent,
          status: isAbsent ? "ABSENT" : "ON_LEAVE",
          totalHours: 0,
          overtimeHours: 0,
          workPolicy: workPolicy?.id,
          shift: shift?.id || null,
        },
      });
    }
  });
};

export default runAttendanceCron;
