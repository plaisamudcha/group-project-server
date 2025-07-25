import prisma from "../config/prisma.js";
import auditService from "../services/audit-log.service.js";
import authService from "../services/auth.service.js";
import userService from "../services/user.service.js";
import createError from "../utils/create-error.util.js";

const userController = {
  // GET
  getAllUsers: async (req, res) => {
    const users = await userService.getAllUsers();
    res.status(200).json({ users });
  },
  // GET
  getUserById: async (req, res) => {
    const { id } = req.params;
    const userIdAsInt = parseInt(id, 10); // แปลง id จาก String เป็น Int
    // --- 👆👆👆 สิ้นสุดส่วนแก้ไข 👆👆👆 ---

    // ตรวจสอบว่าการแปลงค่าสำเร็จหรือไม่
    if (isNaN(userIdAsInt)) {
        createError(400, "User ID ต้องเป็นตัวเลขเท่านั้น");
    }
    const user = await userService.getUserById(userIdAsInt);
    if (!user) {
      createError(400, "ไม่พบผู้ใช้ที่ระบุ");
    }
    res.status(200).json({ user });
  },
  // POST
  createUser: async (req, res) => {
    const { name, email, role, password, ...profileData } = req.body;
    const userData = { name, email, role, password };

    const existingUser = await authService.findExistUser(email);
    if (existingUser) {
      createError(400, "อีเมลนี้ถูกใช้ไปแล้ว");
    }

    const newUserWithPassword = await prisma.$transaction(async (tx) => {
        // 1. สร้าง User และ Profile ภายใน Transaction
        const createdUser = await userService.createUser(userData, profileData, tx);

        // 2. สร้าง Audit Log ภายใน Transaction เดียวกัน
        const data = {
            action: "CREATE",
            relatedTable: "User",
            relatedId: createdUser.id,
            detail: `สร้างผู้ใช้ใหม่: ${createdUser.email}`,
            userId: req.user.id,
        };
        await auditService.createAuditLog(data, tx);

        return createdUser; // คืนค่าผู้ใช้ที่สร้างเสร็จแล้ว
      });

       const { password: hashedPassword, ...newUser } = newUserWithPassword;
      
      // --- 👆👆👆 สิ้นสุดส่วนของ Transaction 👆👆👆 ---
      
      res.status(201).json({ // แนะนำให้ใช้ 201 Created
        message: "สร้างผู้ใช้สำเร็จ",
      user: newUser
    });
},
  // PUT
  updateUser: async (req, res) => {
    const { id } = req.params;
    const userIdAsInt = parseInt(id, 10);

    if (isNaN(userIdAsInt)) {
      return createError(400, "User ID ต้องเป็นตัวเลขเท่านั้น");
    }
    const existingUser = await userService.getUserById(userIdAsInt);
    if (!existingUser) {
      return createError(404, "ไม่พบผู้ใช้ที่ระบุ");
    }
    const result = await prisma.$transaction(async (tx) => {
      const newUser = await userService.updateUser(userIdAsInt, req.body, tx);
      const data = {
        action: "UPDATE",
        relatedTable: "User",
        relatedId: newUser.id,
        detail: "อัปเดตผู้ใช้",
        userId: req.user.id, // Assuming req.user contains the authenticated user's info
      };
      await auditService.createAuditLog(data, tx);
      return newUser;
    });

    res.status(200).json({
      message: "อัปเดตผู้ใช้สำเร็จ",
    });
  },
};

export default userController;
