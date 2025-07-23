import auditService from "../services/audit-log.service.js";
import workPolicyService from "../services/work-policies.service.js";
import createError from "../utils/create-error.util.js";

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
      userId: req.user.id,
    };
    await auditService.createAuditLog(data);
    res.json({ message: "สร้างข้อมูลสำเร็จ" });
  },
  updatePolicy: async (req, res) => {
    const { id } = req.params;
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
    const existPolicy = await workPolicyService.getPolicyById(id);
    if (!existPolicy) createError(400, "ไม่พบ Work policy ที่แก้ไข");
    const workPolicy = await workPolicyService.updatePolicy(
      id,
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
      action: "UPDATE",
      relatedTable: "workPolicy",
      realtedId: workPolicy.id,
      detail: "แก้ไข work policy",
      userId: req.user.id,
    };
    await auditService.createAuditLog(data);
    res.json({ message: "แก้ไขข้อมูลสำเร็จ" });
  },
};

export default workPolicyController;
