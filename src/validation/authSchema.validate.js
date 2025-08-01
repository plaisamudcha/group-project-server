import { object, ref, string } from "yup";
import { RoleType } from "../../generated/prisma/client.js";

const roleType = Object.values(RoleType);

const authSchema = {
  registerSchema: object({
    name: string().required("กรุณาใส่ชื่อ"),
    email: string().email("อีเมลไม่ถูกต้อง").required("กรุณาใส่อีเมล"),
    password: string()
      .min(6, "กรุณาใส่รหัสผ่านอย่างน้อย 6 ตัว")
      .required("กรุณาใส่รหัสผ่าน"),
  }),
  loginSchema: object({
    email: string().email("อีเมลไม่ถูกต้อง").required("กรุณาใส่อีเมล"),
    password: string().required("กรุณาใส่รหัสผ่าน"),
  }),
  forgotSchema: object({
    password: string()
      .min(6, "กรุณาใส่รหัสผ่านอย่างน้อย 6 ตัว")
  }),
};

export default authSchema;
