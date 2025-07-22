import prisma from "../config/prisma.js";

const holidayService = {
    fetchHoliday : () => {
        return  prisma.holiday.findMany()
    },
    createHoliday : (data) => {
        return prisma.holiday.create({data})
    } 
};

export default holidayService;
