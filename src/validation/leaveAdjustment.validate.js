import { date, number, object, ref, string } from "yup";
import { StatusType } from "../../generated/prisma/client.js";
import dayjs from "dayjs";

const statusType = Object.values(StatusType);

const leaveAdjustmentSchema = {
  createLeaveAdjustment: object({
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
  UpdateLeaveAdjustment: object({
    leaveRequestId: number()
      .nullable()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก"),
    deductionMinutes: number()
      .nullable()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก"),
    adjustmentType: string().nullable().oneOf(statusType, "adjustmentType ไม่ถูกต้อง"),
    attendanceId: number()
      .nullable()
      .integer("กรุณาใส่จำนวนเต็มบวก")
      .positive("กรุณาใส่จำนวนเต็มบวก")
  }),
};

export default leaveAdjustmentSchema;
