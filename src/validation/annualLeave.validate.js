import { date, number, object, ref, string } from "yup";
import { LeaveType } from "../../generated/prisma/client.js";

const leaveType = Object.values(LeaveType);

const leaveAnnualSchema = {
  createLeaveAnnual: object({
    year: number()
      .integer("กรุณาใส่จำนวนเต็ม")
      .positive("กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่ปีที่ลา"),
    leaveType: string().oneOf(leaveType, "ประเภทลาไม่ถูกต้อง"),
    entitledDays: number()
      .positive("กรุณาใส่จำนวนบวก")
      .required("กรุณาใส่จำนวนวันลา"),
  }),
  updateLeaveAnnual: object({
    year: number()
      .nullable()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก"),
    leaveType: string().optional().oneOf(leaveType, "ประเภทลาไม่ถูกต้อง"),
    entitledDays: number()
      .optional()
      .positive("กรุณาใส่จำนวนบวก")
  }),

};

export default leaveAnnualSchema;
