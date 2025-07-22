import prisma from "../config/prisma.js";

const auditService = {
    fetchAuditLog: () => {
        return prisma.auditLog.findMany()
    },
    createAuditLog: (data) => {
        return prisma.auditLog.create({data})
    }
};

export default auditService;
