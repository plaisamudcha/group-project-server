import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

const userService = {
   getAllUsers: async () => {
    const users = await prisma.user.findMany({
      // 1. ใช้ include ดึงข้อมูลที่เกี่ยวข้องทั้งหมดตามปกติ  แก้ไขเพราะ ใช้ include กับ omit ไม่ได้
      include: {
        employeeProfile: {
          include: {
            workPolicy: { select: { name: true } },
            shift: { select: { name: true } },
          },
        },
        annualLeaveEntitlements : { select: { 
              id: true,
              year:true,
              leaveType: true,
              entitledDays: true,
              usedDays: true,
              remainingDays: true,
            } },
      },
    });

    // 2. ใช้ JavaScript เพื่อลบรหัสผ่านออกจากทุก object ก่อนส่งกลับ
    return users.map(user => {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    });
  },

  getUserById: async (userId) => {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        employeeProfile: {
          include: {
            workPolicy: { select: { name: true } },
            shift: { select: { name: true } },
          },
        },
      },
    });

    // 3. ถ้าเจอ user ให้ลบรหัสผ่านออกก่อนส่งกลับ
    if (user) {
      const { password, ...userWithoutPassword } = user;
      return userWithoutPassword;
    }
    return null;
  },


  createUser: async (userData, profileData, tx = prisma) => {
    const hashpassword = await bcrypt.hash(userData.password, 12);
    return tx.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        role: userData.role,
        password: hashpassword,

        employeeProfile: {
          create: {
            employmentType: profileData.employmentType,
            workPolicyId: profileData.workPolicyId,
            shiftId: profileData?.shiftId || null,
          },
        },
      },
    });
  },

  updateUser: (userId, updataData, tx = prisma) => {
    return tx.user.update({
      where: {
        id: userId,
      },
      data: updataData,
    });
  },
};

export default userService;
