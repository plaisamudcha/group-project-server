import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

const userService = {
  getAllUsers: () => {
    return prisma.user.findMany({
      include: {
        employeeProfile: true,
      },
    });
  },

  getUserById: (userId) => {
    return prisma.user.findUnique({
      where: {
        id: userId,
      },
      include: {
        employeeProfile: true,
      },
    });
  },

  createUser: async (userData, profileData) => {
    const hashpassword = await bcrypt.hash(userData.password, 12);
    return prisma.user.create({
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

  updateUser: (userId, updataData) => {
    return prisma.user.update({
      where: {
        id: userId,
      },
      data: updataData,
    });
  },

  
};

export default userService;
