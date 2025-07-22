import prisma from "../config/prisma.js";

const holidayService = {
    fetchHoliday : async () => {
        return await  prisma.holiday.findMany()
    },
    createHoliday : async (data) => {
        return await prisma.holiday.create({data})
    } 
};

export default holidayService;
