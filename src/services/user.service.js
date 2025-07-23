import prisma from "../config/prisma.js";

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

  createUser: (userData, profileData) => {
    return prisma.user.create({
      data: {
        name: userData.name,
        email: userData.email,
        role: userData.role,

        employeeProfile: {
          create: {
            employmentType: profileData.employmentType,
            workPolicyId: profileData.workPolicyId,
            shiftId: profileData.shiftId,
          },
        },
      },
      include: {
        employeeProfile: true,
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
