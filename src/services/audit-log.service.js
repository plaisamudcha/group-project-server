import prisma from "../config/prisma.js";

const auditService = {
    fetchAuditLog: () => {
        return prisma.auditLog.findMany()
    },
    createAuditLog: (data,tx = prisma) => {
        return tx.auditLog.create({data})
    }
};

export default auditService;
