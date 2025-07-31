import authService from "../services/auth.service.js";
import createError from "../utils/create-error.util.js";
import genTokenJWT from "../utils/jwt.util.js";
import prisma from "../config/prisma.js";
import sendResetEmail from "../utils/reset-email.util.js";

const authController = {
  register: async (req, res) => {
    const { name, email, password } = req.body;

    const existUser = await authService.findExistUser(email);
    if (existUser) {
      createError(400, "email นี้ถูกใช้งานแล้ว");
    }
    await authService.register(name, email, password);
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

    const accessToken = genTokenJWT.loginToken(payload);
    const refreshToken = genTokenJWT.refreshToken(payload);
    await prisma.refreshToken.create({
      data: {
        token: refreshToken,
        userId: foundUser.id,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
      },
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.json({ message: "เข้าสู่ระบบสำเร็จ", accessToken, user: foundUser });
  },
  forgotPassword: async (req, res) => {
    const { email } = req.body;
    const user = await authService.findExistUser(email);
    if (!user) {
      createError(400, "ไม่พบผู้ใช้งาน");
    }
    const payload = { id: user.id, role: user.role };
    const resetToken = genTokenJWT.forgotPasswordToken(payload);
    await sendResetEmail(user, resetToken);
    res.json({ message: "กรุณาตรวจสอบอีเมลของคุณเพื่อรีเซ็ตรหัสผ่าน" });
  },
  resetPassword: async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;
    const payload = genTokenJWT.checkResetPasswordToken(token);
    const user = await authService.findId(payload.id);
    if (!user) {
      createError(400, "ไม่พบผู้ใช้งาน");
    }
    await authService.resetPassword(user.id, password);
    res.json({ message: "รีเซ็ตรหัสผ่านสำเร็จ" });
  },
  refreshToken: async (req, res) => {
    const { refreshToken } = req.cookies;
    if (!refreshToken) {
      createError(401, "กรุณาเข้าสู่ระบบ");
    }
    const foundToken = await authService.findRefreshToken(refreshToken);
    if (!foundToken) {
      createError(401, "กรุณาเข้าสู่ระบบ");
    }
    let userId = foundToken.userId;
    let role = foundToken.user.role;
    if (new Date() > foundToken.expiresAt) {
      await authService.deleteRefreshToken(refreshToken);
      createError(401, "กรุณาเข้าสู่ระบบ");
    }
    const newrefreshToken = genTokenJWT.refreshToken({ id: userId, role });
    const newAccessToken = genTokenJWT.loginToken({ id: userId, role });
    await authService.updateRefreshToken(newrefreshToken, userId);
    res.cookie("refreshToken", newrefreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "Strict",
      maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    });
    res.json({ message: "รีเฟรชโทเค็นสำเร็จ", newAccessToken });
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
