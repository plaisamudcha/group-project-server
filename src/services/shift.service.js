import prisma from "../config/prisma.js";

const shiftService = {
  getAllShifts: async () => {
    return await prisma.shift.findMany();
  },
  createShift: async (name, inTime, outTime) => {
    return await prisma.shift.create({
      data: { name, inTime, outTime },
    });
  },
  updateShift: async (id, name, inTime, outTime) => {
    return await prisma.shift.update({
      where: { id },
      data: { name, inTime, outTime },
    });
  },
};

export default shiftService;
