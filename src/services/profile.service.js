import prisma from "../config/prisma.js";

const profileService = {
  getProfileByUserId: (userId) => {
    return prisma.employeeProfile.findUnique({
      where: {
        userId: userId,
      },
    });
  },

  updateProfileByUserId: (userId, profileData) => {
    return prisma.employeeProfile.update({
      where: {
        userId: userId,
      },
      data: profileData,
    });
  },
};

export default profileService;
