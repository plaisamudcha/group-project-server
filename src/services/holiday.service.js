import prisma from "../config/prisma.js";

const holidayService = {
    fetchHoliday: async () => {
        return await prisma.holiday.findMany()
    },
    createHoliday: async (data) => {
        return await prisma.holiday.create({ data })
    },
    checkIfOnHoliday: async (newStartDate,newEndDate) => {
        return await prisma.holiday.findFirst({
            where: {
                date: {
                    gte: newStartDate, 
                    lte: newEndDate, 
                }
            }
        })
    },
    patchHoliday : async (id, data) => {
        return await prisma.holiday.update({
            where: {id},
            data
        })
    },
    fetchHolidayById : async (id) => {
        return await prisma.holiday.findMany({
            where : {id}
        })
    },
    deleteHoliday : async (id) => {
        return await prisma.holiday.delete({
            where : {id}
        })
    }
};

export default holidayService;
