import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

const userService = {
  getAllUsers: () => {
    return prisma.user.findMany({
      omit: { password: true },
      include: {
        employeeProfile: {
          include: {
            workPolicy: { select: { name: true } },
            shift: { select: { name: true } },
          },
        },
      },
    });
  },

  getUserById: (userId) => {
    return prisma.user.findUnique({
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
