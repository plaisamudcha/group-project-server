import { date, number, object, ref, string } from "yup";
import { StatusType } from "../../generated/prisma/client.js";

const statusType = Object.values(StatusType);

const leaveAdjustmentSchema = {
  createLeaveAdjustment: object({
    leaveRequestId: number()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่ Request ID"),
    deductionMinutes: number()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่นาทีที่ปรับ"),
    adjustmentType: string()
    .oneOf(statusType, "adjustmentType ไม่ถูกต้อง")
    .required("กรุณาใส่ Adjustment Type"),
    attendanceId: number()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนเต็มบวก")
      .required("กรุณาใส่ Attendance ID"),
  }),
  updateLeaveAdjustment: object({
    leaveRequestId: number()
      .optional()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนเต็มบวก"),
    deductionMinutes: number()
      .optional()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนเต็มบวก"),
    adjustmentType: string()
      .optional()
      .oneOf(statusType, "Adjustment Type ไม่ถูกต้อง"),
    attendanceId: number()
      .optional()
      .integer("กรุณาใส่จำนวนเต็ม")
      .min(0, "กรุณาใส่จำนวนเต็มบวก"),
  }),
};

export default leaveAdjustmentSchema;
