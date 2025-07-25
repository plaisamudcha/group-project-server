import prisma from "../config/prisma.js";

const profileService = {
  getProfileByUserId: (userId, tx = prisma) => {
    return tx.employeeProfile.findUnique({
      where: {
        userId: userId,
      },
    });
  },

  updateProfileByUserId: (userId, profileData, tx = prisma) => {
    return tx.employeeProfile.update({
      where: {
        userId: userId,
      },
      data: profileData,
    });
  },
};

export default profileService;
