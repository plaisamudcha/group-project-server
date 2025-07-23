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
    const updatedProfile = await profileService.updateProfileByUserId(
      userId,
      req.body
    );
    res.status(200).json(updatedProfile);
  },
};

export default profileController;
