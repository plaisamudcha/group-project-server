import prisma from "../src/config/prisma.js";
import bcrypt from "bcryptjs";

const workPolicies = [
  {
    name: "ปกติ",
    startTime: "08:30",
    endTime: "17:30",
    allowedLateMinutesPerMonth: 60,
    workingDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"],
    minHoursForHalfDay: 4,
    halfDayAbsentRule: 0.5,
    deductIfLateOver: 0,
  },
  {
    name: "นักศึกษาฝึกงาน",
    startTime: "09:00",
    endTime: "16:00",
    allowedLateMinutesPerMonth: 30,
    workingDays: ["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"],
    minHoursForHalfDay: 4,
    halfDayAbsentRule: 0.5,
    deductIfLateOver: 0,
  },
  // เพิ่มเติมได้ตามต้องการ
];
const holidays2025 = [
  { name: "New Year's Day", date: "2025-01-01" },
  { name: "Makha Bucha Day", date: "2025-02-10" },
  { name: "Songkran Day", date: "2025-04-13" },
  { name: "Labor Day", date: "2025-05-01" },
  { name: "HM King's Birthday", date: "2025-07-28" },
  { name: "Mother's Day", date: "2025-08-12" },
  { name: "Chulalongkorn Day", date: "2025-10-23" },
  { name: "Father's Day", date: "2025-12-05" },
  { name: "Constitution Day", date: "2025-12-10" },
  { name: "New Year's Eve", date: "2025-12-31" },
];

async function main() {
  console.log("🌱 Seeding Work Policies...");
  await prisma.leaveAdjustment.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.annualLeaveEntitlement.deleteMany();
  await prisma.refreshToken.deleteMany();

  // 2. ลบ EmployeeProfile และ Attendance ที่อ้างอิงถึง User, WorkPolicy, Shift
  await prisma.employeeProfile.deleteMany();
  await prisma.attendance.deleteMany();

  // 3. ลบ LeaveRequest ที่อ้างอิงถึง User
  await prisma.leaveRequest.deleteMany();

  // 4. ตอนนี้สามารถลบ User, WorkPolicy, และ Shift ได้แล้ว
  await prisma.user.deleteMany();
  await prisma.workPolicy.deleteMany();
  await prisma.shift.deleteMany();

  // 5. ลบตารางที่ไม่ค่อยมีใครอ้างอิงถึง
  await prisma.holiday.deleteMany();

  console.log('✅ Old data cleared.');

  // --- สร้างข้อมูลใหม่ ---
  console.log('🌱 Seeding new data...');
  //
  // ใส่โค้ดสำหรับสร้างข้อมูล (seed) ของคุณต่อจากตรงนี้
  // เช่น await prisma.workPolicy.createMany({...})
  //
  const firstPolicy = await prisma.workPolicy.create({ data: workPolicies[0] }); // ⬅ สร้างตัวแรกไว้เก็บ ID
  for (let i = 1; i < workPolicies.length; i++) {
    await prisma.workPolicy.create({ data: workPolicies[i] });
  }

  console.log("📅 Seeding Holidays...");
  for (const holiday of holidays2025) {
    await prisma.holiday.create({
      data: {
        name: holiday.name,
        date: holiday.date,
      },
    });
  }

  console.log("👤 Seeding initial HR user...");
  const hashedPassword = await bcrypt.hash("password123", 12);

  await prisma.user.create({
    data: {
      name: "HR Admin",
      email: "hr.admin@example.com",
      password: hashedPassword,
      role: "HR",
      // สร้าง EmployeeProfile ที่เชื่อมกันไปด้วยเลย
      employeeProfile: {
        create: {
          employmentType: "FULLTIME",
          workPolicyId: firstPolicy.id, // ใช้ ID ของ policy แรกที่สร้าง
        },
      },
    },
  });
  // --- 👆👆👆 สิ้นสุดส่วนที่เพิ่มเข้ามา 👆👆👆 ---

  console.log("✅ Done seeding!");
}

// function test (){
//   console.log("seed here")
// }

//  test ()
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
