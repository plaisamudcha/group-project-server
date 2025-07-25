import { text } from "express";
import profileService from "../services/profile.service.js";
import createError from "../utils/create-error.util.js";

const profileController = {
  getProfileByUserId: async (req, res) => {
    const { userId } = req.params;
    const profile = await profileService.getProfileByUserId(userId);
    if (!profile) {
      createError(400, "ไม่พบโปรไฟล์ที่ระบุ");
    }
    res.status(200).json(profile);
  },

  updateProfileByUserId: async (req, res) => {
    const { userId } = req.params;

    const updatedProfile = await prisma.$transaction(async (tx) => {
      // 1. อัปเดตโปรไฟล์
      const profile = await profileService.updateProfileByUserId(
        userId,
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
