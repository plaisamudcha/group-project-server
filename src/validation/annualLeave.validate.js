import { date, number, object, ref, string } from "yup";
import { LeaveType } from "../../generated/prisma/client.js";

const leaveType = Object.values(LeaveType);

const leaveAnnualSchema = {
  createLeaveAnnual: object({
    userId: string().required("กรุณาใส่ ID ของ User"),
    year: number()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่ปีที่ลา"),
    leaveType: string().oneOf(leaveType, "ประเภทลาไม่ถูกต้อง"),
    entitledDays: number()
      .positive("กรุณาใส่จำนวนบวก")
      .required("กรุณาใส่จำนวนวันลา"),
  }),
  UpdateLeaveAnnual: object({
    userId: string().nullable(),
    year: number()
      .nullable()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก"),
    leaveType: string().nullable().oneOf(leaveType, "ประเภทลาไม่ถูกต้อง"),
    entitledDays: number()
      .nullable()
      .positive("กรุณาใส่จำนวนบวก")
  }),

};

export default leaveAnnualSchema;
