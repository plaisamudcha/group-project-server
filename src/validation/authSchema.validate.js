import { object, ref, string } from "yup";
import { RoleType } from "../../generated/prisma/client.js"

const roleType = Object.values(RoleType)


const authSchema = {
    registerSchema: object({
        name: string().required('กรุณาใส่ชื่อ'),
        email: string().email('อีเมลไม่ถูกต้อง').required('กรุณาใส่อีเมล'),
        role: string().oneOf(roleType, 'Role ไม่ถูกต้อง').required('กรุณาใส่ Role'),
        password: string().min(12, 'กรุณาใส่รหัสผ่านอย่างน้อย 12 ตัว').required('กรุณาใส่รหัสผ่าน'),
        workPolicyId: string().required('กรุณาใส่ WorkPolicy'),
    }),
    loginSchema: object({
        email: string().required('กรุณาใส่อีเมล'),
        password: string().required('กรุณาใส่รหัสผ่าน')
    }) 
};

export default authSchema;
