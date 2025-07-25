import { date, number, object, ref, string } from "yup";
import { LeaveType, StatusLeave } from "../../generated/prisma/client.js";

const leaveType = Object.values(LeaveType);
const statusType = Object.values(StatusLeave);

// endDate ต้องไม่เป็นอดีต และ เพิ่มจำกัดความยาวของเหตุผล

const leaveSchema = {
  createOrUpdateLeaveRequest: object({
    startDate: date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : new Date(originalValue)
      )
      .typeError("กรุณากรอกวันที่ให้ถูกต้อง") 
      .required("กรุณาใส่วันลา"),
    endDate: date()
      .nullable()
      .transform((value, originalValue) =>
        originalValue === "" ? null : new Date(originalValue)
      )
      .typeError("กรุณากรอกวันที่ให้ถูกต้อง") 
      .required("กรุณาใส่วันลา").min(ref("startDate"), "วันสิ้นสุดต้องมากกว่าวันเริ่ม"),
    leaveType: string().oneOf(leaveType, "leaveType ไม่ถูกต้อง"),
    status: string().oneOf(statusType, "status ไม่ถูกต้อง"),
    reason: string().required("กรุณาใส่เหตุผล").max(500, "เหตุผลยาวเกินไป"),
    userId: string().required("กรุณาใส่ UserId"),
  }),
};

export default leaveSchema;
