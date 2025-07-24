import { date, number, object, ref, string } from "yup";
import { StatusType } from "../../generated/prisma/client.js";

const statusType = Object.values(StatusType);

const leaveAdjustmentSchema = {
  createOrUpdateLeaveAdjustment: object({
    leaveRequestId: number()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่ request ID"),
    deductionMinutes: number()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่นาทีที่ลา"),
    adjustmentType: string().oneOf(statusType, "adjustmentType ไม่ถูกต้อง"),
    attendanceId: number()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่ attenddance ID"),
  }),
};

export default leaveAdjustmentSchema;
