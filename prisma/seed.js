// เนื่องจาก Prisma Client ถูกสร้างไปที่ "../generated/prisma"
// เราจะ import จากที่ที่ถูกต้อง
import { PrismaClient } from '../generated/prisma/index.js';
import bcrypt from 'bcryptjs';

// สร้าง Prisma Client instance
const prisma = new PrismaClient();

// กำหนด enums ตามที่มีใน schema จริง
const ENUMS = {
  RoleType: {
    EMPLOYEE: 'EMPLOYEE',
    HR: 'HR'
  },
  LeaveType: {
    SICK: 'SICK',
    PERSONAL: 'PERSONAL',
    VACATION: 'VACATION',
    UNPAID: 'UNPAID',
    MATERNITY: 'MATERNITY'
  },
  StatusLeave: {
    PENDING: 'PENDING',
    APPROVED: 'APPROVED',
    REJECTED: 'REJECTED'
  },
  LeaveSession: {
    FULL_DAY: 'FULL_DAY',
    HALF_DAY_MORNING: 'HALF_DAY_MORNING',
    HALF_DAY_AFTERNOON: 'HALF_DAY_AFTERNOON'
  },
  EmploymentType: {
    FULLTIME: 'FULLTIME',
    PARTTIME: 'PARTTIME'
  },
  StatusType: {
    PENDING: 'PENDING',
    ABSENT: 'ABSENT',
    ON_LEAVE: 'ON_LEAVE',
    COMPLETED: 'COMPLETED',
    INCOMPLETED: 'INCOMPLETED'
  },
  AnnualLeaveEntitlement_leaveType: {
    SICK: 'SICK',
    PERSONAL: 'PERSONAL',
    VACATION: 'VACATION',
    UNPAID: 'UNPAID',
    MATERNITY: 'MATERNITY'
  },
  LeaveAdjustment_adjustmentType: {
    PENDING: 'PENDING',
    ABSENT: 'ABSENT',
    ON_LEAVE: 'ON_LEAVE',
    COMPLETED: 'COMPLETED',
    INCOMPLETED: 'INCOMPLETED'
  }
};

// --- Helper Functions ---
const hashPassword = async (password) => {
  const saltRounds = 12;
  return bcrypt.hash(password, saltRounds);
};

function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function formatDate(date) {
  return date.toISOString().split('T')[0];
}

// ---ข้อมูลตั้งต้น (ภาษาไทย)---
const workPolicies = [
  {
    name: "ปกติ",
    startTime: "08:30",
    endTime: "17:30",
    allowedLateMinutesPerMonth: 60,
    workingDays: JSON.stringify(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]),
    minHoursForHalfDay: 4,
    halfDayAbsentRule: 0.5,
    deductIfLateOver: 0,
    remark: "นโยบายการทำงานปกติ 8:30 - 17:30 น."
  },
  {
    name: "นักศึกษาฝึกงาน",
    startTime: "09:00",
    endTime: "16:00",
    allowedLateMinutesPerMonth: 30,
    workingDays: JSON.stringify(["MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY"]),
    minHoursForHalfDay: 4,
    halfDayAbsentRule: 0.5,
    deductIfLateOver: 0,
    remark: "นโยบายสำหรับนักศึกษาฝึกงาน"
  },
];

const holidays2025 = [
  { name: "วันขึ้นปีใหม่", date: "2025-01-01" },
  { name: "วันมาฆบูชา", date: "2025-02-12" },
  { name: "วันจักรี", date: "2025-04-07" }, // Adjusted for Monday
  { name: "วันสงกรานต์", date: "2025-04-13" },
  { name: "วันสงกรานต์", date: "2025-04-14" },
  { name: "วันสงกรานต์", date: "2025-04-15" },
  { name: "วันแรงงานแห่งชาติ", date: "2025-05-01" },
  { name: "วันเฉลิมพระชนมพรรษาสมเด็จพระนางเจ้าฯ พระบรมราชินี", date: "2025-06-03" },
  { name: "วันเฉลิมพระชนมพรรษาพระบาทสมเด็จพระวชิรเกล้าเจ้าอยู่หัว", date: "2025-07-28" },
  { name: "วันแม่แห่งชาติ", date: "2025-08-12" },
  { name: "วันคล้ายวันสวรรคต ร.9", date: "2025-10-13" },
  { name: "วันปิยมหาราช", date: "2025-10-23" },
  { name: "วันพ่อแห่งชาติ", date: "2025-12-05" },
  { name: "วันรัฐธรรมนูญ", date: "2025-12-10" },
  { name: "วันสิ้นปี", date: "2025-12-31" },
];

async function main() {
  // Use the ENUMS object instead of the destructured enums
  const usersToCreate = [
    { name: 'สมชาย ใจดี', firstName: 'สมชาย', lastName: 'ใจดี', email: 'somchai.j@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'สมศรี มีสุข', firstName: 'สมศรี', lastName: 'มีสุข', email: 'somsri.m@example.com', role: ENUMS.RoleType.HR },
    { name: 'มานะ อดทน', firstName: 'มานะ', lastName: 'อดทน', email: 'mana.o@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'ปิติ ยินดี', firstName: 'ปิติ', lastName: 'ยินดี', email: 'piti.y@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'วีณา กล้าหาญ', firstName: 'วีณา', lastName: 'กล้าหาญ', email: 'weena.k@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'อาทิตย์ สุขใจ', firstName: 'อาทิตย์', lastName: 'สุขใจ', email: 'artit.s@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'จันทรา แจ่มใส', firstName: 'จันทรา', lastName: 'แจ่มใส', email: 'chantra.j@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'อังคาร อารี', firstName: 'อังคาร', lastName: 'อารี', email: 'angkan.a@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'พุธ เพียรดี', firstName: 'พุธ', lastName: 'เพียรดี', email: 'put.p@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'พฤหัสบดี ศรีงาม', firstName: 'พฤหัสบดี', lastName: 'ศรีงาม', email: 'pruhat.s@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'ศุกร์ สดใส', firstName: 'ศุกร์', lastName: 'สดใส', email: 'suk.s@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'เสาวลักษณ์ มั่นคง', firstName: 'เสาวลักษณ์', lastName: 'มั่นคง', email: 'saowalak.m@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'เกรียงไกร ชัยชนะ', firstName: 'เกรียงไกร', lastName: 'ชัยชนะ', email: 'kriengkrai.c@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'นภาวรรณ งามวิไล', firstName: 'นภาวรรณ', lastName: 'งามวิไล', email: 'napawan.n@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'ธนพล เจริญยิ่ง', firstName: 'ธนพล', lastName: 'เจริญยิ่ง', email: 'tanapon.j@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'เพ็ญแข เรืองฤทธิ์', firstName: 'เพ็ญแข', lastName: 'เรืองฤทธิ์', email: 'penkae.r@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'วิรัช สุจริต', firstName: 'วิรัช', lastName: 'สุจริต', email: 'wirat.s@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'อมราภรณ์ พัฒนา', firstName: 'อมราภรณ์', lastName: 'พัฒนา', email: 'amaraporn.p@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'เอกชัย บรรลือ', firstName: 'เอกชัย', lastName: 'บรรลือ', email: 'ekachai.b@example.com', role: ENUMS.RoleType.EMPLOYEE },
    { name: 'ทิพวรรณ บริหาร', firstName: 'ทิพวรรณ', lastName: 'บริหาร', email: 'thippawan.b@example.com', role: ENUMS.RoleType.HR },
  ];

  console.log(`🌱 เริ่มทำการ Seed ข้อมูล...`);

  // --- 1. ล้างข้อมูลเก่า ---
  console.log('🗑️ กำลังล้างข้อมูลเก่าในฐานข้อมูล...');
  await prisma.leaveAdjustment.deleteMany();
  await prisma.attendance.deleteMany();
  await prisma.leaveRequest.deleteMany();
  await prisma.annualLeaveEntitlement.deleteMany();
  await prisma.employeeProfile.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.refreshToken.deleteMany();
  await prisma.user.deleteMany();
  await prisma.workPolicy.deleteMany();
  await prisma.shift.deleteMany();
  await prisma.holiday.deleteMany();
  console.log('✅ ล้างข้อมูลเก่าเรียบร้อยแล้ว');

  // --- 2. สร้างนโยบายการทำงาน (Work Policies) ---
  console.log('🏢 กำลังสร้างนโยบายการทำงาน...');
  const createdPolicies = await Promise.all(
    workPolicies.map(policy => prisma.workPolicy.create({ data: policy }))
  );
  const standardWorkPolicy = createdPolicies[0];
  console.log(`✅ สร้างนโยบายการทำงาน ${createdPolicies.length} รายการ`);

  // --- 3. สร้างกะการทำงาน (Shifts) ---
  console.log('⏰ กำลังสร้างกะการทำงาน...');
  const morningShift = await prisma.shift.create({ data: { name: 'กะเช้า', inTime: '08:30', outTime: '17:30' } });
  const nightShift = await prisma.shift.create({ data: { name: 'กะดึก', inTime: '20:00', outTime: '05:00' } });
  console.log(`✅ สร้างกะการทำงาน 2 กะ (เช้า, ดึก)`);

  // --- 4. สร้างวันหยุด (Holidays) ---
  console.log('📅 กำลังสร้างข้อมูลวันหยุด...');
  await prisma.holiday.createMany({ data: holidays2025 });
  console.log(`✅ สร้างวันหยุด ${holidays2025.length} วัน`);

  // --- 5. สร้างผู้ใช้งานและข้อมูลที่เกี่ยวข้อง ---
  console.log(`👤 กำลังสร้างผู้ใช้งาน ${usersToCreate.length} คน...`);
  const hashedPassword = await hashPassword('password123');
  const createdUsers = [];

  for (const userData of usersToCreate) {
    const user = await prisma.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        employeeProfile: {
          create: {
            workPolicyId: standardWorkPolicy.id,
            // Assign some users to the night shift
            shiftId: ['วีณา กล้าหาญ', 'เกรียงไกร ชัยชนะ', 'เพ็ญแข เรืองฤทธิ์'].includes(userData.name) ? nightShift.id : morningShift.id,
            employmentType: ENUMS.EmploymentType.FULLTIME,
          },
        },
      },
    });
    createdUsers.push(user);
    console.log(`   - สร้างผู้ใช้: ${user.name}`);

    // สร้างสิทธิ์การลา (ใช้ enum ที่ถูกต้อง)
    const currentYear = new Date().getFullYear();
    await prisma.annualLeaveEntitlement.createMany({
      data: [
        { userId: user.id, year: currentYear, leaveType: ENUMS.AnnualLeaveEntitlement_leaveType.SICK, entitledDays: 30, remainingDays: 30 },
        { userId: user.id, year: currentYear, leaveType: ENUMS.AnnualLeaveEntitlement_leaveType.PERSONAL, entitledDays: 7, remainingDays: 7 },
        { userId: user.id, year: currentYear, leaveType: ENUMS.AnnualLeaveEntitlement_leaveType.VACATION, entitledDays: 10, remainingDays: 10 },
        { userId: user.id, year: currentYear, leaveType: ENUMS.AnnualLeaveEntitlement_leaveType.UNPAID, entitledDays: 999, remainingDays: 999 },
        { userId: user.id, year: currentYear, leaveType: ENUMS.AnnualLeaveEntitlement_leaveType.MATERNITY, entitledDays: 90, remainingDays: 90 },
      ],
    });
  }
  console.log('✅ สร้างผู้ใช้งานและสิทธิ์การลาเรียบร้อยแล้ว');

  // --- 6. สร้างใบลาตัวอย่าง ---
  console.log('📝 กำลังสร้างใบลาตัวอย่าง...');
  const leaveRequestsToCreate = [
      { userEmail: 'somchai.j@example.com', startDate: '2025-07-15', endDate: '2025-07-15', leaveType: ENUMS.LeaveType.PERSONAL, status: ENUMS.StatusLeave.APPROVED, reason: 'ทำธุระส่วนตัว' },
      { userEmail: 'mana.o@example.com', startDate: '2025-08-20', endDate: '2025-08-22', leaveType: ENUMS.LeaveType.VACATION, status: ENUMS.StatusLeave.PENDING, reason: 'ลาพักร้อน' },
      { userEmail: 'piti.y@example.com', startDate: '2025-07-22', endDate: '2025-07-22', leaveType: ENUMS.LeaveType.SICK, status: ENUMS.StatusLeave.REJECTED, reason: 'ป่วย (เอกสารไม่ครบ)' },
      { userEmail: 'weena.k@example.com', startDate: '2025-07-30', endDate: '2025-07-30', leaveType: ENUMS.LeaveType.SICK, status: ENUMS.StatusLeave.APPROVED, reason: 'ไปพบแพทย์' },
      { userEmail: 'artit.s@example.com', startDate: '2025-06-10', endDate: '2025-06-11', leaveType: ENUMS.LeaveType.VACATION, status: ENUMS.StatusLeave.APPROVED, reason: 'พักผ่อนกับครอบครัว' },
      { userEmail: 'chantra.j@example.com', startDate: '2025-05-05', endDate: '2025-05-05', leaveType: ENUMS.LeaveType.PERSONAL, status: ENUMS.StatusLeave.APPROVED, reason: 'ติดต่อราชการ' },
  ];
  
  const createdLeaveRequests = [];
  for(const req of leaveRequestsToCreate) {
      const user = createdUsers.find(u => u.email === req.userEmail);
      if(!user) continue;

      const startDate = new Date(req.startDate);
      const endDate = new Date(req.endDate);
      const leaveDays = (endDate.getTime() - startDate.getTime()) / (1000 * 3600 * 24) + 1;

      const leaveRequest = await prisma.leaveRequest.create({
          data: {
              userId: user.id,
              startDate: req.startDate,
              endDate: req.endDate,
              leaveDays: leaveDays,
              leaveType: req.leaveType,
              status: req.status,
              leaveSession: ENUMS.LeaveSession.FULL_DAY,
              reason: req.reason,
          }
      });
      createdLeaveRequests.push(leaveRequest);

      // ถ้าอนุมัติแล้ว ให้หักวันลา
      if(leaveRequest.status === 'APPROVED') {
          await prisma.annualLeaveEntitlement.updateMany({
              where: { userId: user.id, year: new Date().getFullYear(), leaveType: req.leaveType },
              data: {
                  usedDays: { increment: leaveDays },
                  remainingDays: { decrement: leaveDays }
              }
          });
      }
  }
  console.log(`✅ สร้างใบลา ${createdLeaveRequests.length} รายการ`);

  // --- 7. สร้างข้อมูลการเข้างานย้อนหลัง 5 เดือน (ประมาณ 150 วัน) ---
  console.log('🏃 กำลังสร้างข้อมูลการเข้างานย้อนหลัง 5 เดือน...');
  const today = new Date();
  const holidayDates = new Set(holidays2025.map(h => h.date));
  const workingDays = ["SUNDAY", "MONDAY", "TUESDAY", "WEDNESDAY", "THURSDAY", "FRIDAY", "SATURDAY"];
  const ATTENDANCE_DAYS = 150;

  for (const user of createdUsers) {
    const profile = await prisma.employeeProfile.findUnique({ where: { userId: user.id }, include: { workPolicy: true, shift: true } });
    if (!profile) continue;

    const userWorkingDays = new Set(JSON.parse(profile.workPolicy.workingDays));
    console.log(`   - กำลังสร้างข้อมูลเข้างานสำหรับ ${user.name}...`);

    for (let i = 0; i < ATTENDANCE_DAYS; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      const dateString = formatDate(date);
      const dayName = workingDays[date.getDay()];

      if (holidayDates.has(dateString) || !userWorkingDays.has(dayName)) {
        continue;
      }

      const approvedLeave = createdLeaveRequests.find(lr =>
        lr.userId === user.id &&
        lr.status === 'APPROVED' &&
        dateString >= lr.startDate && dateString <= lr.endDate
      );

      if (approvedLeave) {
        const attendance = await prisma.attendance.create({
          data: {
            userId: user.id,
            date: dateString,
            isAbsent: true,
            status: ENUMS.StatusType.ON_LEAVE,
            workPolicyId: profile.workPolicyId,
            shiftId: profile.shiftId,
          },
        });
        await prisma.leaveAdjustment.create({
            data: {
                leaveRequestId: approvedLeave.id,
                attendanceId: attendance.id,
                deductionMinutes: 480, // 8 hours
                adjustmentType: ENUMS.LeaveAdjustment_adjustmentType.ON_LEAVE
            }
        });
        continue;
      }
      
      if (Math.random() < 0.05) { // 5% chance of being absent
          await prisma.attendance.create({
              data: {
                  userId: user.id,
                  date: dateString,
                  isAbsent: true,
                  status: ENUMS.StatusType.ABSENT,
                  workPolicyId: profile.workPolicyId,
                  shiftId: profile.shiftId,
              }
          });
          continue;
      }

      const isLate = Math.random() < 0.2; // 20% chance of being late
      const lateMinutes = isLate ? getRandomInt(5, 45) : 0;
      const clockInHour = parseInt(profile.shift.inTime.split(':')[0]);
      const clockInMinute = parseInt(profile.shift.inTime.split(':')[1]);

      const clockInTime = new Date(date);
      clockInTime.setHours(clockInHour, clockInMinute + lateMinutes, 0, 0);
      
      const clockOutTime = new Date(clockInTime);
      const workDurationHours = profile.shift.inTime > profile.shift.outTime ? (24 - clockInHour) + parseInt(profile.shift.outTime.split(':')[0]) : parseInt(profile.shift.outTime.split(':')[0]) - clockInHour;
      clockOutTime.setHours(clockOutTime.getHours() + workDurationHours + (Math.random() > 0.5 ? 0 : -1), getRandomInt(0, 59));

      const totalHours = (clockOutTime.getTime() - clockInTime.getTime()) / (1000 * 60 * 60);

      await prisma.attendance.create({
        data: {
          userId: user.id,
          date: dateString,
          clockIn: `${String(clockInTime.getHours()).padStart(2, '0')}:${String(clockInTime.getMinutes()).padStart(2, '0')}`,
          clockOut: `${String(clockOutTime.getHours()).padStart(2, '0')}:${String(clockOutTime.getMinutes()).padStart(2, '0')}`,
          isLate: isLate,
          lateMinutes: lateMinutes,
          totalHours: parseFloat(totalHours.toFixed(2)),
          status: ENUMS.StatusType.COMPLETED,
          workPolicyId: profile.workPolicyId,
          shiftId: profile.shiftId,
        },
      });
    }
  }
  console.log('✅ สร้างข้อมูลการเข้างานย้อนหลังเรียบร้อยแล้ว');

  console.log(`🎉 Seed ข้อมูลเสร็จสมบูรณ์!`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });