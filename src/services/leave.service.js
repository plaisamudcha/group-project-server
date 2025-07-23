import prisma from "../config/prisma.js";

const leaveService = {
    GetAllLeave: () => {
        return prisma.leaveRequest.findMany({
            orderBy: {
                createdAt: 'desc'
            },
            include: {
                adjustments: true
            }
        });
    },
    GetUserLeave: (userid) => {
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
    GetLeaveDetails: (leaveid) => {
        return prisma.leaveRequest.findUnique(
            {
                where: {
                    leaveid: leaveid
                },
                include: {
                    adjustments: true
                }
            })
    },
    CheckOverLaptime:(userid,statdate,enddate)=>{
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
    CreateNewLeavesRequest:(data)=>{
        return  prisma.leaveRequest.create({
            data: data
        });
    }
};

export default leaveService;