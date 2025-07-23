import authService from "../services/auth.service.js";
import prisma from "../config/prisma.js";
import createError from "../utils/create-error.util.js";
import genTokenJWT from "../utils/jwt.util.js";

const authController = {
  register: async (req, res) => {
    const { name, email, password } = req.body;

    const existUser = await authService.findExistUser(email);
    console.log(existUser);
    if (existUser) {
      createError(400, "email นี้ถูกใช้งานแล้ว");
    }
    const newUser = await authService.register(name, email, password);
    res.json({
      message: "สมัครสำเร็จ",
    });
  },
  login: async (req, res) => {
    const { email, password } = req.body;
    const foundUser = await authService.login(email, password);
    if (!foundUser) {
      createError(400, "ชื่อผู้ใช้หรือรหัสผ่าน ผิดพลาด");
    }
    const payload = {
      id: foundUser.id,
      role: foundUser.role,
    };

    const assessToken = genTokenJWT.loginToken(payload);

    const { password: hashedPassword, ...user } = foundUser;

    res.json({ message: "เข้าสู่ระบบสำเร็จ", assessToken, user });
  },

  getMe: async (req, res) => {
    const user = await authService.findId(req.user.id);
    if (!user) {
      createError(400, "ไม่พบผู้ใช้งาน");
    }
    res.json({
      user,
    });
  },
};

export default authController;
