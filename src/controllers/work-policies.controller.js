import auditService from "../services/audit-log.service.js";
import workPolicyService from "../services/work-policies.service.js";

const workPolicyController = {
  getAllPolicies: async (req, res) => {
    const policies = await workPolicyService.getAllPolicies();
    res.json({ policies });
  },
  createPolicy: async (req, res) => {
    const {
      name,
      startTime,
      endTime,
      allowedLateMinutesPerMonth,
      deductIfLateOver,
      minHoursForHalfDay,
      halfDayAbsentRule,
      remark,
    } = req.body;
    const workPolicy = await workPolicyService.createPolicy(
      name,
      startTime,
      endTime,
      allowedLateMinutesPerMonth,
      deductIfLateOver,
      minHoursForHalfDay,
      halfDayAbsentRule,
      remark
    );
    const data = {
      action: "CREATE",
      relatedTable: "workPolicy",
      realtedId: workPolicy.id,
      detail: "สร้าง work policy ใหม่",
    };
    await auditService.createAuditLog(data);
    res.json({ message: "สร้างข้อมูลสำเร็จ" });
  },
  updatePolicy: async (req, res) => {},
};

export default workPolicyController;
