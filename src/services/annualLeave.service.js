import prisma from "../config/prisma.js";
import createError from "../utils/create-error.util.js";

const annualLeaveService = {
     checkBalance: async (userId, leaveDays, leaveType, year) => {
        const entitlement = await prisma.annualLeaveEntitlement.findFirst({
            where: { userId, year, leaveType },
        });

        if (!entitlement || entitlement.remainingDays < leaveDays) {
            
            createError (400,`โควต้าวันลาปี ${year} ประเภท ${leaveType} ไม่เพียงพอ`);
        }
        return entitlement;
    },


    deductFromBalance: async (entitlementId, daysToDeduct, tx = prisma) => {
        await tx.annualLeaveEntitlement.update({
            where: { id: entitlementId },
            data: {
                usedDays: { increment: daysToDeduct },
                remainingDays: { decrement: daysToDeduct },
            },
        });
    },
    refundBalance: async (userId, leaveType, year, daysToRefund, tx = prisma) => {
        const entitlement = await tx.annualLeaveEntitlement.findFirst({
            where: { userId, year, leaveType },
        });

        if (!entitlement) {
            throw new Error(`ไม่พบโควต้าของปี ${year} ประเภท ${leaveType} ที่จะทำการคืนยอด`);
        }

        return tx.annualLeaveEntitlement.update({
            where: { id: entitlement.id },
            data: {
                usedDays: { decrement: daysToRefund },
                remainingDays: { increment: daysToRefund },
            },
        });
    }, getAllEntitlements: async () => {
        return prisma.annualLeaveEntitlement.findMany({
            include: {
                user: { 
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                }
            }
        });
    },

 
    getEntitlementsByUserId: async (userId) => {
        return prisma.annualLeaveEntitlement.findMany({
            where: { userId: userId },
        });
    },

  
    updateEntitlement: async (id, data) => {
        
        const remainingDays = data.entitledDays - data.usedDays;

        return prisma.annualLeaveEntitlement.update({
            where: { id: id },
            data: {
                entitledDays: data.entitledDays,
                usedDays: data.usedDays,
                remainingDays: remainingDays, 
            },
        });
    },
};

export default annualLeaveService;
