import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";
import authService from "./auth.service.js";

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
    const hashedPassword = await authService.hashPassword(userData.password);

    return await tx.user.create({
      data: {
        ...userData,
        password: hashedPassword,
        employeeProfile: {
          create: {
            employmentType: profileData.employmentType,
            // ใช้ workPolicyId ที่ได้รับมา
            workPolicyId: profileData.workPolicyId, 
            shiftId: null,
          },
        },
      },
      include: {
        employeeProfile: true, // ดึงข้อมูลโปรไฟล์ที่สร้างขึ้นมาด้วย
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
   deleteUser: async (userId, tx = prisma) => {
    return await tx.user.delete({
      where: { id: userId },
    });
  },
};

export default userService;
