import annualLeaveService from "../services/annualLeave.service.js";

const annualLeaveController = {
   
    getAllEntitlements: async (req, res, next) => {
        
            const entitlements = await annualLeaveService.getAllEntitlements();
            res.status(200).json(entitlements);
       
    },

    getUserEntitlements: async (req, res, next) => {
        
            const  userId  = req.params.id;
            if (req.user.role !== 'HR' && req.user.id !== userId) {
                return res.status(403).json({ message: "คุณไม่มีสิทธิ์ดูข้อมูลนี้" });
            }

            const entitlements = await annualLeaveService.getEntitlementsByUserId(userId);
            res.status(200).json(entitlements);
      
    },

  
    updateEntitlement: async (req, res, next) => {
            const { id } = req.params;
            const { entitledDays, usedDays } = req.body;

            if (req.user.role !== 'HR') {
                return res.status(403).json({ message: "คุณไม่มีสิทธิ์แก้ไขข้อมูลนี้" });
            }

            if (typeof entitledDays !== 'number' || typeof usedDays !== 'number') {
                return res.status(400).json({ message: "entitledDays และ usedDays ต้องเป็นตัวเลข" });
            }

            const updatedEntitlement = await annualLeaveService.updateEntitlement(parseInt(id), {
                entitledDays,
                usedDays,
            });

            res.status(200).json({
                message: "อัปเดตโควต้าวันลาสำเร็จ",
                data: updatedEntitlement,
            });
}
}
export default annualLeaveController;
