import { date, number, object, ref, string } from "yup";
import { StatusType } from "../../generated/prisma/client.js";

const statusType = Object.values(StatusType);

const attendanceSchema = {
  createOrUpdateAttendance: object({
    date: date().required("กรุณาใส่วันทำงาน"),
    status: string().oneOf(statusType, "status ไม่ถูกต้อง"),
    workPolicyId: number()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่ workpolicy"),
  }),
};

export default attendanceSchema;
