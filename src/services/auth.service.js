import prisma from "../config/prisma.js";
import bcrypt from "bcryptjs";

const authService = {
  findExistUser: async (email) => {
    return await prisma.user.findUnique({
      where: {
        email
      }
    })
  },
  findId: async (id) => {
    return await prisma.user.findUnique({
      where:{
        id
      },
      omit:{
        password: true
      }
    })
  },
  register: async (name, email, password) => {
    const hashedPassword = await bcrypt.hash(password, 12);
    return await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: "EMPLOYEE"
      }
    })
  },
  login: async (email, password) =>  {
    console.log(email, password);
    const user = await prisma.user.findUnique({
      where: {email}
    })
    console.log(user)
    if(!user){
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password)
    console.log(isMatch)
    return isMatch? user : null;
  }
};


export default authService;