import prisma from "../config/prisma.js";
import auditService from "../services/audit-log.service.js";
import workPolicyService from "../services/work-policies.service.js";
import createError from "../utils/create-error.util.js";

const workPolicyController = {
  getAllPolicies: async (req, res) => {
    const policies = await workPolicyService.getAllPolicies();
    res.json({ policies });
  },
  createPolicy: async (req, res) => {
    console.log(req.body);
    const {
      name,
      startTime,
      endTime,
      allowedLateMinutesPerMonth,
      deductIfLateOver,
      minHoursForHalfDay,
      halfDayAbsentRule,
      remark,
      workingDays,
    } = req.body;
    const workPolicy = await workPolicyService.createPolicy(
      name,
      startTime,
      endTime,
      allowedLateMinutesPerMonth,
      deductIfLateOver,
      minHoursForHalfDay,
      halfDayAbsentRule,
      remark,
      workingDays
    );
    const data = {
      action: "CREATE",
      relatedTable: "workPolicy",
      relatedId: workPolicy.id,
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
    const existPolicy = await workPolicyService.getPolicyById(parseInt(id));
    if (!existPolicy) createError(400, "ไม่พบ Work policy ที่แก้ไข");
    const workPolicy = await workPolicyService.updatePolicy(
      parseInt(id),
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
      relatedId: workPolicy.id,
      detail: "แก้ไข work policy",
      userId: req.user.id,
    };
    await auditService.createAuditLog(data);
    res.json({ message: "แก้ไขข้อมูลสำเร็จ" });
  },
   assignPolicy: async (req, res) => {
    const { policyId, employeeIds } = req.body;

    if (!policyId || !Array.isArray(employeeIds) || employeeIds.length === 0) {
      return createError(400, "ข้อมูลไม่ถูกต้อง, กรุณาเลือก policy และพนักงาน");
    }

    const result = await prisma.$transaction(async (tx) => {
      // 1. เรียกใช้ Service เพื่ออัปเดตโปรไฟล์ของพนักงาน
      const updatedCount = await workPolicyService.assignPolicyToEmployees(
        policyId,
        employeeIds,
        tx
      );

      // 2. สร้าง Audit Log
      const data = {
        action: "UPDATE",
        relatedTable: "EmployeeProfile",
        relatedId: policyId, // ใช้ policyId เป็น ID อ้างอิง
        detail: `มอบหมาย Policy ID: ${policyId} ให้กับพนักงาน ${employeeIds.length} คน`,
        userId: req.user.id,
      };
      await auditService.createAuditLog(data, tx);

      return updatedCount;
    });

    res.json({
      message: `มอบหมาย Policy ให้กับพนักงาน ${result.count} คนสำเร็จ`,
      count: result.count,
    });
  },
};

export default workPolicyController;
