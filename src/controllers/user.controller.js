import userService from "../services/user.service.js";
import createError from "../utils/create-error.util.js";

const userController = {
  // GET
  getAllUsers: async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json(users);
  },
  // GET
  getUserById: async (req, res) => {
    const id = req.params;
    const user = await userService.getUserById(id);
    if (!user) {
      createError(400, "ไม่พบผู้ใช้ที่ระบุ");
    }
    res.status(200).json(user);
  },
  // POST
  createUser: async (req, res) => {
    const { name, email, role, ...profileData } = req.body;
    const userData = { name, email, role };

    const newUser = await userService.createUser(userData, profileData);
    res.status(200).json(newUser);
  },
  // PUT
  updateUser: async (req, res) => {
    const { id } = req.params;
    const updatedUser = await userService.updateUser(id, req.body);
    res.status(200).json(updatedUser);
  },
  // GET
  getProfileByUserId: async (req, res) => {
    const { userId } = req.params;
    const profile = await userService.getProfileByUserId(userId);
    if (!profile) {
      createError(400, "ไม่พบโปรไฟล์ที่ระบุ");
    }
    res.status(200).json(profile);
  },

  updateProfileByUserId: async (req, res) => {
    const { userId } = req.params;
    const updatedProfile = await userService.updateProfileByUserId(
      userId,
      req.body
    );
    res.status(200).json(updatedProfile);
  },
};

export default userController;
