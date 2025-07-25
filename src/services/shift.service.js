import prisma from "../config/prisma.js";

const shiftService = {
  getAllShifts: async () => {
    return await prisma.shift.findMany();
  },
  createShift: async (data, tx = prisma) => {
    return await tx.shift.create({
      data,
    });
  },
  updateShift: async (id, name, inTime, outTime, tx = prisma) => {
    return await tx.shift.update({
      where: { id },
      data: { name, inTime, outTime },
    });
  },
};

export default shiftService;
