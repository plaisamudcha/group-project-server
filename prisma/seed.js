import prisma from "../src/config/prisma.js";

const baseDate = "1970-01-01";

const workPolicies = [
  {
    policyName: "ปกติ",
    startTime: "08:30",
    endTime: "17:30",
    allowedLateMinutesPerMonth: 60,
    deductIfLateOver: true,
    halfDayAbsentRule: "AFTER_LUNCH",
  },
  {
    policyName: "นักศึกษาฝึกงาน",
    startTime: "09:00",
    endTime: "16:00",
    allowedLateMinutesPerMonth: 30,
    deductIfLateOver: false,
    halfDayAbsentRule: "NONE",
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
  await prisma.workPolicy.deleteMany();
  await prisma.holiday.deleteMany();
  console.log("🌱 Seeding Work Policies...");
  for (const policy of workPolicies) {
    await prisma.workPolicy.create({ data: policy });
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
