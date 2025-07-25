import prisma from "../config/prisma.js";
import annualLeaveService from "../services/annualLeave.service.js";
import auditService from "../services/audit-log.service.js";

const annualLeaveController = {
  getAllEntitlements: async (req, res, next) => {
    const entitlements = await annualLeaveService.getAllEntitlements();
    res.status(200).json({ entitlements });
  },

  getUserEntitlements: async (req, res, next) => {
    const entitlements = await annualLeaveService.getEntitlementsByUserId(
      req.user.id
    );
    res.status(200).json({ entitlements });
  },

  updateEntitlement: async (req, res, next) => {
    const { id } = req.params;
    const { entitledDays, usedDays } = req.body;
    const updatedEntitlement = await annualLeaveService.updateEntitlement(
      parseInt(id),
      {
        entitledDays,
        usedDays,
      }
    );
    await auditService.createAuditLog({
      action: 'UPDATE',
      relatedTable: 'AnnualLeaveEntitlement',
      relatedId: updatedEntitlement.id,
      detail: `Updated entitlement ID ${id}. Set entitled to ${entitledDays}, used to ${usedDays}.`,
      userId: req.user.id
    });
    res.status(200).json({
      message: "อัปเดตโควต้าวันลาสำเร็จ",
      data: updatedEntitlement,
    });
  },
  createEntitlement: async (req, res, next) => {

    const { year, leaveType, entitledDays } = req.body;
    const userId = parseInt(req.body.userId)

    const result = prisma.$transaction(async (tx) => {
      const newEntitlement = await annualLeaveService.createEntitlement({
        userId,
        year,
        leaveType,
        entitledDays,
      },tx);
      await auditService.createAuditLog({
        action: 'CREATE',
        relatedTable: 'AnnualLeaveEntitlement',
        relatedId: newEntitlement.id,
        detail: `Created entitlement for user ${userId} (${leaveType}, ${year}) with ${entitledDays} days.`,
        userId: req.user.id,

      },tx);
    return newEntitlement
    })

    res.status(201).json({
      message: "สร้างโควต้าวันลาสำเร็จ",
      data: result,
    });
  },
}
export default annualLeaveController;
