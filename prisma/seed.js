import prisma from "../src/config/prisma.js";

const baseDate = "1970-01-01";

const workPolicies = [
  {
    name: "ปกติ",
    startTime: new Date(`${baseDate}T09:00:00Z`),
    endTime: new Date(`${baseDate}T18:00:00Z`),
    allowedLateMinutesPerMonth: 100,
    deductIfLateOver: 0,
    minHoursForHalfDay: 240,
    halfDayAbsentRule: 0.5,
    remark: "สำหรับ Full-time",
  },
  {
    name: "พนักงานชั่วคราว",
    startTime: new Date(`${baseDate}T10:00:00Z`),
    endTime: new Date(`${baseDate}T17:00:00Z`),
    allowedLateMinutesPerMonth: 30,
    deductIfLateOver: 0,
    minHoursForHalfDay: 240,
    halfDayAbsentRule: 0.5,
    remark: "สำหรับ Part-time",
  },
  {
    name: "นักศึกษาฝึกงาน",
    startTime: new Date(`${baseDate}T09:30:00Z`),
    endTime: new Date(`${baseDate}T16:30:00Z`),
    allowedLateMinutesPerMonth: 15,
    deductIfLateOver: 0,
    minHoursForHalfDay: 240,
    halfDayAbsentRule: 0.5,
    remark: "สำหรับนักศึกษา",
  },
];

const holidays2025 = [
  { name: "วันขึ้นปีใหม่", date: new Date("2025-01-01") },
  { name: "วันมาฆบูชา", date: new Date("2025-02-11") },
  { name: "วันจักรี", date: new Date("2025-04-06") },
  { name: "วันสงกรานต์", date: new Date("2025-04-13") },
  { name: "วันแรงงานแห่งชาติ", date: new Date("2025-05-01") },
  { name: "วันวิสาขบูชา", date: new Date("2025-05-12") },
  { name: "วันเฉลิมพระชนมพรรษา ร.10", date: new Date("2025-07-28") },
  { name: "วันแม่แห่งชาติ", date: new Date("2025-08-12") },
  { name: "วันปิยมหาราช", date: new Date("2025-10-23") },
  { name: "วันพ่อแห่งชาติ", date: new Date("2025-12-05") },
  { name: "วันรัฐธรรมนูญ", date: new Date("2025-12-10") },
  { name: "วันสิ้นปี", date: new Date("2025-12-31") },
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
