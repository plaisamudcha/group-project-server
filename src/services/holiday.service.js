import prisma from "../config/prisma.js";

const holidayService = {
    fetchHoliday: async () => {
        return await prisma.holiday.findMany()
    },
    createHoliday: async (data) => {
        return await prisma.holiday.create({ data })
    },
    checkIfOnHoliday: async (newStartDate,newEndDate) => {
        return await prisma.holiday.findfirst({
            where: {
                date: {
                    gte: newStartDate, 
                    lte: newEndDate, 
                }
            }
        });
    }
};

export default holidayService;
