import prisma from "../config/prisma.js";

const profileService = {
  getProfileByUserId: (userId, tx = prisma) => {
    return tx.employeeProfile.findUnique({
      where: { userId: Number(userId) },
      include: {
        user: true,
        workPolicy: true,
        shift: true,
      },
      include: {workPolicy: true, shift: true},
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
    
 
  assignShift: async (userId, shiftId, tx = prisma) => {
    return await tx.employeeProfile.update({
      where: { userId: userId },
      data: { shiftId: shiftId },
    });
  },

  
  removeShift: async (userId, tx = prisma) => {
    return await tx.employeeProfile.update({
      where: { userId: userId },
      data: { shiftId: null },
    });
  },

};

export default profileService;
