import auditService from "../services/audit-log.service.js";

const auditController = {
    getAuditLog: async (req, res) => {
        const resAuditLog = await auditService.fetchAuditLog()
        if (resAuditLog.length === 0) {
            res.status(200).json({message: 'ไม่พบข้อมูล'})
        }

        res.status(200).json({message: 'ขอดูวันหยุดสำเร็จ', auditLog: {...resAuditLog}})
    }
};

export default auditController;
