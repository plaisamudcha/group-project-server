import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

const authService = {
  findExistUser: async (email) => {
    return await prisma.user.findUnique({
      where: {
        email,
      },
      omit: {
        password: true,
      },
    });
  },
  findId: async (id) => {
    return await prisma.user.findUnique({
      where: {
        id,
      },
      omit: {
        password: true,
      },
    });
  },
  register: async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "EMPLOYEE",
      },
    });
  },
  login: async (email, password) => {
    const user = await prisma.user.findUnique({
      where: { email },
    });
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    return isMatch ? user : null;
  },
  resetPassword: async (id, password) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return await prisma.user.update({
      where: { id },
      data: { password: hashedPassword },
    });
  },
  findRefreshToken: async (token) => {
    return await prisma.refreshToken.findUnique({
      where: { token },
      include: {
        user: true,
      },
    });
  },
  deleteRefreshToken: async (token) => {
    return await prisma.refreshToken.delete({
      where: { token },
    });
  },
  updateRefreshToken: async (token, userId) => {
    return await prisma.refreshToken.updateMany({
      where: { token },
      data: {
        userId,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });
  },
};

export default authService;
