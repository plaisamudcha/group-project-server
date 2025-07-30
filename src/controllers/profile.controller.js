import profileService from "../services/profile.service.js";
import createError from "../utils/create-error.util.js";
import prisma from "../config/prisma.js";
import auditService from "../services/audit-log.service.js";

const profileController = {
  getProfileByUserId: async (req, res) => {
    const { userId } = req.params;
    const userIdAsInt = parseInt(userId, 10);

    // --- 👇 1. ตรวจสอบ Input ก่อน ---
    if (isNaN(userIdAsInt)) {
      createError(400, "User ID ต้องเป็นตัวเลขเท่านั้น");
    }

    // --- 👇 2. ตรวจสอบสิทธิ์ทีหลัง ---
    const { id: requesterId, role: requesterRole } = req.user;
    if (requesterRole !== "HR" && requesterId !== userIdAsInt) {
      createError(403, "คุณไม่มีสิทธิ์เข้าถึงโปรไฟล์นี้");
    }
    
    // --- 3. ทำงานตามปกติ ---
    const profile = await profileService.getProfileByUserId(userIdAsInt);
    if (!profile) {
      // (แนะนำ) แก้เป็น 404 Not Found
      createError(400, "ไม่พบโปรไฟล์ที่ระบุ");
    }
    res.status(200).json(profile);
  },

  updateProfileByUserId: async (req, res) => {
    const { userId } = req.params;
    const userIdAsInt = parseInt(userId, 10);

    if (isNaN(userIdAsInt)) {
      createError(400, "User ID ต้องเป็นตัวเลขเท่านั้น");
    }

    const updatedProfile = await prisma.$transaction(async (tx) => {
      // 1. อัปเดตโปรไฟล์
      const profile = await profileService.updateProfileByUserId(
        userIdAsInt,
        req.body,
        tx // <--- ส่ง tx เข้าไป
      );

      // 2. สร้าง Audit Log
      const data = {
        action: "UPDATE",
        relatedTable: "EmployeeProfile",
        relatedId: profile.id,
        detail: `อัปเดตโปรไฟล์ของ user ID: ${userId}`,
        userId: req.user.id,
      };
      await auditService.createAuditLog(data, tx); // (ทำให้ auditService รองรับ tx ด้วย)

      return profile;
    });

    res.status(200).json({
      message: "อัปเดตโปรไฟล์สำเร็จ",
      profile: updatedProfile,
    });
  },
};

export default profileController;
