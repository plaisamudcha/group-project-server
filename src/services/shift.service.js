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
   updateShift: async (id, data, tx = prisma) => { // ปรับปรุงเล็กน้อย
    return await tx.shift.update({
      where: { id },
      data: data,
    });
  },
   getAllShiftsWithEmployees: async () => {
      return await prisma.shift.findMany({
      include: {
        employeeProfiles: { 
          select: {
            user: { 
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
    });
  },
};

export default shiftService;
