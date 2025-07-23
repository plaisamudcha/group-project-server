import auditService from "../services/audit-log.service.js";
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
    const data = {
      action: "CREATE",
      relatedTable: "User",
      relatedId: newUser.id,
      detail: "สร้างผู้ใช้ใหม่",
      userId: req.user.id, // Assuming req.user contains the authenticated user's info
    };
    await auditService.createAuditLog(data);

    res.status(200).json({
      message: "สร้างผู้ใช้สำเร็จ",});
  },
  // PUT
  updateUser: async (req, res) => {
    const { id } = req.params;
    const newUser = await userService.updateUser(id, req.body);
    const data = {
      action: "UPDATE",
      relatedTable: "User",
      relatedId: newUser.id,
      detail: "อัปเดตผู้ใช้",
      userId: req.user.id, // Assuming req.user contains the authenticated user's info
    };
    await auditService.createAuditLog(data);
    res.status(200).json({
      message: "อัปเดตผู้ใช้สำเร็จ",
    });
  },
  
  
};

export default userController;
