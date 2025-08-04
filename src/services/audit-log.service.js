import prisma from "../config/prisma.js";

const auditService = {
    fetchAuditLog: () => {
        return prisma.auditLog.findMany({
            include: {
                user: {  
                    select: {
                        id: true,
                        name: true,
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'  
            }
        })
    },
    createAuditLog: (data,tx = prisma) => {
        return tx.auditLog.create({data})
    }
};

export default auditService;
