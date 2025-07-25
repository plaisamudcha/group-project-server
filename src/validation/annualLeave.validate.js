import { date, number, object, ref, string } from "yup";
import { LeaveType } from "../../generated/prisma/client.js";

const leaveType = Object.values(LeaveType);

const leaveAnnualSchema = {
  createOrUpdateLeaveAnnual: object({
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
};

export default leaveAnnualSchema;
