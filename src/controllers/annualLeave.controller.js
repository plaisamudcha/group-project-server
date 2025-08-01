import prisma from "../config/prisma.js";
import annualLeaveService from "../services/annualLeave.service.js";
import auditService from "../services/audit-log.service.js";
import createError from "../utils/create-error.util.js";

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
    try {
      const { year, leaveType, entitledDays } = req.body;
      const userId = parseInt(req.body.userId)

      const result = await prisma.$transaction(async (tx) => {
        const newEntitlement = await annualLeaveService.createEntitlement({
          userId,
          year,
          leaveType,
          entitledDays,
        }, tx);
        await auditService.createAuditLog({
          action: 'CREATE',
          relatedTable: 'AnnualLeaveEntitlement',
          relatedId: newEntitlement.id,
          detail: `Created entitlement for user ${userId} (${leaveType}, ${year}) with ${entitledDays} days.`,
          userId: req.user.id,

        }, tx);
        return newEntitlement
      })

      res.status(201).json({
        message: "สร้างโควต้าวันลาสำเร็จ",
        data: result,
      });
    } catch (error) {

      if (error.code === 'P2002') {
        const { userId, year, leaveType } = req.body;
        return createError(409, `โควต้าสำหรับพนักงาน ID ${userId} ในปี ${year} ประเภท ${leaveType} มีอยู่แล้ว`);
      }
      next(error);
    }
  },
  createOrUpdateUserEntitlements: async (req, res, next) => {

    const { userId, year, entitlements } = req.body;

    if (!userId || !year || !entitlements || !Array.isArray(entitlements)) {
     createError(400, "ข้อมูลไม่ถูกต้อง กรุณาระบุ userId, year, และ entitlements");
    }

    const existingEntitlements = await annualLeaveService.getEntitlementsByUserIdAndYear(parseInt(userId), parseInt(year));
    const usedDaysMap = new Map();
    existingEntitlements.forEach(ent => {
      usedDaysMap.set(ent.leaveType, ent.usedDays);
    });

    const entitlementsToCreate = entitlements.map(ent => {
      const usedDays = usedDaysMap.get(ent.leaveType) || 0;
      const remainingDays = ent.entitledDays - usedDays;

      if (remainingDays < 0) {
        throw createError(400, `โควต้าที่กำหนด (${ent.entitledDays}) น้อยกว่าจำนวนวันที่ใช้ไปแล้ว (${usedDays}) สำหรับประเภท ${ent.leaveType}`);
      }

      return {
        userId: parseInt(userId),
        year: parseInt(year),
        leaveType: ent.leaveType,
        entitledDays: ent.entitledDays,
        usedDays: usedDays,
        remainingDays: remainingDays,
      };
    });

    const result = await prisma.$transaction(async (tx) => {
      await annualLeaveService.deleteEntitlementsByUserAndYear(parseInt(userId), parseInt(year), tx);
      const createdResult = await annualLeaveService.createManyEntitlements(entitlementsToCreate, tx);
      await auditService.createAuditLog({
        action: 'UPDATE',
        relatedTable: 'AnnualLeaveEntitlement',
        relatedId: parseInt(userId),
        detail: `Created/Updated ${createdResult.count} entitlement types for user ID ${userId} for year ${year}.`,
        userId: req.user.id,
      }, tx);
      return createdResult;
    });

    res.status(201).json({
      message: `สร้าง/อัปเดตโควต้าสำเร็จ ${result.count} รายการ`,
      data: result,
    });

  }
  ,

  createBulkEntitlements: async (req, res, next) => {
    
      const { year, userIds, entitlements } = req.body;

      if (!userIds || userIds.length === 0 || !entitlements || entitlements.length === 0) {
        return next(createError(400, "กรุณาระบุข้อมูลพนักงานและโควต้าให้ครบถ้วน"));
      }

      const entitlementsToCreate = [];
      for (const userId of userIds) {
        for (const ent of entitlements) {
          entitlementsToCreate.push({
            userId: parseInt(userId),
            year: parseInt(year),
            leaveType: ent.leaveType,
            entitledDays: ent.entitledDays,
            remainingDays: ent.entitledDays,
          });
        }
      }

      const result = await prisma.$transaction(async (tx) => {
        const createdResult = await annualLeaveService.createManyEntitlements(entitlementsToCreate, tx);
        await auditService.createAuditLog({
          action: 'CREATE',
          relatedTable: 'AnnualLeaveEntitlement',
          relatedId: 0,
          detail: `Bulk created ${createdResult.count} entitlements for ${userIds.length} users for the year ${year}.`,
          userId: req.user.id,
        }, tx);
        return createdResult;
      });

      res.status(201).json({
        message: `สร้างโควต้าวันลาสำเร็จจำนวน ${result.count} รายการ`,
        data: result,
      });

   
  },


  deleteUserEntitlements: async (req, res, next) => {

    const { userId, year } = req.params;

    if (!userId || !year) {
      return next(createError(400, "กรุณาระบุ userId และ year"));
    }

    const result = await prisma.$transaction(async (tx) => {
      const deletedResult = await annualLeaveService.deleteEntitlementsByUserAndYear(parseInt(userId), parseInt(year), tx);

      if (deletedResult.count === 0) {
        // ไม่จำเป็นต้อง throw error แค่แจ้งว่าไม่พบข้อมูลให้ลบ
        console.log(`No entitlements found to delete for user ID ${userId} in year ${year}.`);
      }

      await auditService.createAuditLog({
        action: 'DELETE',
        relatedTable: 'AnnualLeaveEntitlement',
        relatedId: parseInt(userId),
        detail: `Deleted ${deletedResult.count} entitlement types for user ID ${userId} for year ${year}.`,
        userId: req.user.id,
      }, tx);

      return deletedResult;
    });

    res.status(200).json({
      message: `ลบโควต้าของพนักงาน ID ${userId} ในปี ${year} สำเร็จจำนวน ${result.count} รายการ`,
      data: result,
    });


  }
}
export default annualLeaveController;
