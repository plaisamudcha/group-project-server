import { date, number, object, ref, string } from "yup";
import { LogAction } from "../../generated/prisma/client.js";

//นี่ก็ไม่ได้ใช้

const logAction = Object.values(LogAction);

const auditLogSchema = {
  createOrUpdateAudit: object({
    action: string().oneOf(logAction, "actionType ไม่ถูกต้อง"),
    relatedTable: string().required("กรุณาใส่ตารางที่จัดการ"),
    realatedId: number()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่ related ID"),
    detail: string().required("กรุณาใส่รายละเอียด"),
    userId: string().required("กรุณาใส่ UserId"),
  }),
};

export default auditLogSchema;
