import prisma from "../config/prisma.js";

const leaveService = {
    getAllLeave: () => {
        return prisma.leaveRequest.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                adjustments: true
            }
        });
    },
    getUserLeave: (userid) => {
        return prisma.leaveRequest.findMany(
            {
                where: {
                    userId: userid
                },
                orderBy: {
                    createdAt: 'desc'
                },
                include: {
                    adjustments: true
                }
            })
    },
    getLeaveDetails: (leaveid) => {
        return prisma.leaveRequest.findUnique(
            {
                where: {
                    id: leaveid
                },
                include: {
                    adjustments: true
                }
            })
    },
    checkOverLaptime:(userid,statdate,enddate)=>{
        return  prisma.leaveRequest.findFirst({
            where: {
                userId: userid,
                status: {
                    in: ['PENDING', 'APPROVED'] 
                },

                startDate: {
                    lte: statdate 
                },
                endDate: {
                    gte: enddate 
                }
            }
        });
    },
    createLeaveRequest: async (leaveData, tx = prisma) => {
        return tx.leaveRequest.create({
            data: leaveData,
        });
    },
    updateStatus: async (leaveId, status, tx = prisma) => {
        return tx.leaveRequest.update({
            where: { id: leaveId },
            data: { status: status },
        });
    },
};

export default leaveService;