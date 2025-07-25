import { object, ref, string } from "yup";
import { RoleType } from "../../generated/prisma/client.js";

const roleType = Object.values(RoleType);

const authSchema = {
  registerSchema: object({
    name: string().required("กรุณาใส่ชื่อ"),
    email: string().email("อีเมลไม่ถูกต้อง").required("กรุณาใส่อีเมล"),
    role: string().oneOf(roleType, "บทบาทไม่ถูกต้อง").required("กรุณาใส่บทบาท"),
    password: string()
      .min(6, "กรุณาใส่รหัสผ่านอย่างน้อย 6 ตัว")
      .required("กรุณาใส่รหัสผ่าน"),
    workPolicyId: string().required("กรุณาใส่ นโยบายการทำงาน"),
  }),
  loginSchema: object({
    email: string().email("อีเมลไม่ถูกต้อง").required("กรุณาใส่อีเมล"),
    password: string().required("กรุณาใส่รหัสผ่าน"),
  }),
};

export default authSchema;
